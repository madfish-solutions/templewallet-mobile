Feature: Import existing wallet


  Scenario: As a user, I'd like to import account with existing seed phrase
    Given I am on the welcome page
    And I press Import Existing Wallet button on Welcome page

    And I am on the importExistingWallet page
    And I enter seed into Seed Phrase Input on Import existing Wallet page
    And I press Next button on Import existing Wallet page

    And I am on the createNewPasswordImportAccount page
    And I enter password into Password Input on Create a new Password page when Import Account
    And I enter password into Repeat Password Input on Create a new Password page when Import Account
    And I press Accept Terms Checkbox on Create a new Password page when Import Account
    And I press Import button on Create a new Password page when Import Account

    Then I am on the wallet page
