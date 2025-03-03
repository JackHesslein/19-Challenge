describe('End-to-End Quiz Flow', () => {
    beforeEach(() => {
      // Visit the page where the Quiz component is rendered
      // Replace '/' with your actual application URL or path
      cy.visit('http://localhost:3001');
    });
  
    it('Should allow a user to complete the quiz and view their score', () => {
      // Intercept the API request to fetch questions
      cy.intercept('GET', '/api/questions', {
        fixture: 'questions.json', // Mock data for the questions
      }).as('getQuestions');
      cy.wait(2000);
  
      // Start the quiz
      cy.get('.btn').contains('Start Quiz', { timeout: 10000 }).should('exist').click();
  
      // Wait for the questions to load
      //cy.wait('@getQuestions');
      cy.get('h2').should('exist'); // Ensure the first question is displayed
  
      // Answer all the questions
      cy.fixture('questions.json').then((questions) => {
        questions.forEach((question, index) => {
          // Ensure the question text matches
          cy.get('h2').should('not.be.empty');
  
          // Select the correct answer (can also test incorrect answers if needed)
          const correctAnswerIndex = question.answers.findIndex((a) => a.isCorrect);
          cy.get('button')
            .contains((correctAnswerIndex + 1).toString())
            .should('exist')
            .click();
  
          // If it's not the last question, check the next question loads
          if (index < questions.length) {
            cy.get('h2').should('not.contain.text', question.question).should('not.be.empty');
          }
        });
      });
  
      // Verify the quiz completion screen
      cy.get('h2', { timeout: 10000 }).contains('Quiz Completed').should('exist');
      cy.get('.alert-success').should('contain.text', 'Your score:');
  
      // Restart the quiz
      cy.get('button').contains('Take New Quiz').should('exist').click();
  
      // Verify that the quiz restarts
      cy.get('button').contains('Start Quiz').should('exist');
    })});