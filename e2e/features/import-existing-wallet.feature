Feature: Import existing wallet

  Scenario: As a user, I'd like to import account with existing seed phrase
    Given I am on the welcome page
    And I press IMPORT EXISTING WALLET button

    And I am on the importExistingWallet page
    And I type SEED PHRASE into SEED PHRASE input
    And I press NEXT button

    And I am on the createNewPassword page
    And I type PASSWORD into PASSWORD input
    And I type PASSWORD into REPEAT PASSWORD input
    And I press ACCEPT TERMS checkbox
    And I press IMPORT button

    Then I am on the wallet page
