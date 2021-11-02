Feature: Create new wallet

  @dev
  Scenario: As a user, I'd like to create account with new seed phrase
    Given I am on the welcome page
    And I press CREATE NEW WALLET button

    And I am on the createNewWallet page
    And I press GEN NEW button in SEED PHRASE output
    And I press COPY button in SEED PHRASE output
    And I save seed phrase
    And I press MADE SEED PHRASE BACKUP checkbox
    And I press NEXT button

    And I am on the verifyYourSeed page
    And I enter correct seed words
    And I press Verify your seed NEXT button

