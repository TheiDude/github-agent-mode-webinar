Feature: About Page Navigation and Display
  As a user interested in OctoCAT Supply
  I want to view the About page
  So that I can learn about the company's mission and values

  Scenario: Navigate to About page from Home
    Given I am on the home page
    When I click the "About us" navigation link
    Then I should be on the About page
    And I should see the heading "About OctoCAT Supply"

  Scenario: About page displays company mission
    Given I am on the About page
    Then I should see the section "Our Meow-ssion"
    And I should see the section "Our Purr-pose"
    And I should see the key features list with at least 6 items

  Scenario: About page is accessible via direct URL
    Given I navigate directly to the About page URL
    Then I should be on the About page
    And the page title should contain "OctoCAT Supply"
