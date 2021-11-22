Feature: Create new wallet

  @dev
  Scenario: As a user, I'd like to create account with new seed phrase
    Given I am on the welcome page
    And I press Create New Wallet button on Welcome page

    And I am on the createNewWallet page
    And I press Gen New button on Create a new Wallet page
    And I press Copy button on Create a new Wallet page
    And I save seed phrase
    And I press I made Seed Phrase backup checkbox
    And I press Next button on Create a new Wallet page

    And I am on the verifyYourSeed page
    And I enter correct seed words
    And I press Next button on Verify your seed page

    And I am on the createNewPasswordCreateAccount page
    And I enter password into Password Input on Create a new Password page when Create Account
    And I enter password into Repeat Password Input on Create a new Password page when Create Account
    And I press Accept Terms Checkbox on Create a new Password page when Create Account
    And I press Create button on Create a new Password page when Create Account

    Then I am on the wallet page
