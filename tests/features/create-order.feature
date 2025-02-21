Feature: Create Order
  As a customer
  I want to create a new order
  So that I can purchase products

  Scenario: Creating a valid order
    Given I have a valid order request with customer "any_customer_id"
    And the request includes a product "any_product_id" with quantity 1
    When I try to create the order
    Then the response should have status code 201
    And the response should contain the created order data
    And the create order use case should be called with correct parameters

  Scenario: Creating an order with invalid customer
    Given I have an invalid order request with customer "invalid_customer_id"
    And the request includes a product "any_product_id" with quantity 1
    When I try to create the order
    Then it should throw a NotFoundError with message "Customer not found" 