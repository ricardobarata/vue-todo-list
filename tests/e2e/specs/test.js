describe("Todo E2E Test", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
    cy.contains(".v-toolbar__title", "Todo List");
  });
});
