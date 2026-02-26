package com.templewallet

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableNativeArray
import java.io.File

/**
 * One-time migration from legacy AsyncStorage DB (RKStorage / catalystLocalStorage)
 * used by @react-native-async-storage/async-storage 1.x. Reads from RKStorage if it exists
 * and returns entries so JS can multiSet into current storage.
 */
class LegacyAsyncStorageMigrationModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = NAME

    companion object {
        const val NAME = "LegacyAsyncStorageMigration"
        private const val LEGACY_DB_NAME = "RKStorage"
        private const val LEGACY_TABLE = "catalystLocalStorage"
        private const val COL_KEY = "key"
        private const val COL_VALUE = "value"
        private const val PREF_NAME = "legacy_async_storage_migration"
        private const val PREF_KEY_DONE = "migration_done"
    }

    @ReactMethod
    fun getLegacyStorageData(promise: Promise) {
        Thread {
            try {
                if (reactApplicationContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE).getBoolean(PREF_KEY_DONE, false)) {
                    promise.resolve(null)
                    return@Thread
                }
                val dbFile = reactApplicationContext.applicationContext.getDatabasePath(LEGACY_DB_NAME)
                if (!dbFile.exists()) {
                    markDone()
                    promise.resolve(null)
                    return@Thread
                }
                val entries = readLegacyEntries(dbFile) ?: run {
                    markDone()
                    promise.resolve(null)
                    return@Thread
                }
                if (entries.size() == 0) {
                    markDone()
                    promise.resolve(null)
                    return@Thread
                }
                promise.resolve(entries)
            } catch (e: Exception) {
                Log.e(NAME, "getLegacyStorageData failed", e)
                promise.reject("LEGACY_MIGRATION_ERROR", e.message, e)
            }
        }.start()
    }

    @ReactMethod
    fun setLegacyMigrationDone(promise: Promise) {
        try {
            markDone()
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    private fun markDone() {
        reactApplicationContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            .edit().putBoolean(PREF_KEY_DONE, true).apply()
    }

    private fun readLegacyEntries(dbFile: File): WritableArray? {
        var db: SQLiteDatabase? = null
        try {
            db = SQLiteDatabase.openDatabase(dbFile.absolutePath, null, SQLiteDatabase.OPEN_READONLY)
            val cursor = db.query(LEGACY_TABLE, arrayOf(COL_KEY, COL_VALUE), null, null, null, null, null) ?: return null
            val result = WritableNativeArray()
            cursor.use {
                val keyIdx = it.getColumnIndex(COL_KEY)
                val valueIdx = it.getColumnIndex(COL_VALUE)
                if (keyIdx < 0 || valueIdx < 0) return null
                while (it.moveToNext()) {
                    val key = it.getString(keyIdx) ?: continue
                    val pair = WritableNativeArray()
                    pair.pushString(key)
                    pair.pushString(it.getString(valueIdx) ?: "")
                    result.pushArray(pair)
                }
            }
            return result
        } catch (e: Exception) {
            Log.e(NAME, "readLegacyEntries failed", e)
            return null
        } finally {
            db?.close()
        }
    }
}
