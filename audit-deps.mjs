import { exec } from "child_process";

exec("yarn audit --level high", (error, stdout) => {
  if (error) {
    console.log(stdout);

    if (stdout.includes("High") || stdout.includes("Critical")) {
      // delete after ip package will be patched
      if (stdout.includes("1096432") && stdout.includes("1 High") && stdout.includes("No patch available") && !stdout.includes("Critical")) return;

      throw new Error("Audit failed");
    }
  }
});
