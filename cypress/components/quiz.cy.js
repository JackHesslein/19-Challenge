describe('Quiz Component', () => {
    beforeEach(() => {
      // Visit the page where the Quiz component is rendered
      // Adjust the URL path if needed
      cy.visit('/');
    });
  
    it('Should render the start quiz button', () => {
      cy.get('button').contains('Start Quiz').should('exist');
    });
  
    it('Should start the quiz and load questions', () => {
      cy.intercept('GET', '/api/questions', {
        fixture: 'questions.json', // Mock questions data
      }).as('getQuestions');
  
      // Click the start quiz button
      cy.get('button').contains('Start Quiz').click();
  
      // Wait for the questions API to load
      cy.wait('@getQuestions');
  
      // Verify the first question is displayed
      cy.get('h2').should('exist');
      cy.get('h2').should('contain.text', 'Question 1'); // Replace with actual question text if needed
    });
  
    it('Should allow the user to answer questions', () => {
      cy.intercept('GET', '/api/questions', {
        fixture: 'questions.json',
      }).as('getQuestions');
  
      cy.get('button').contains('Start Quiz').click();
      cy.wait('@getQuestions');
  
      // Click the first answer button
      cy.get('button').contains('1').click();
  
      // Verify the next question is displayed or quiz is completed
      cy.get('h2').should('exist');
    });
  
    it('Should complete the quiz and display the score', () => {
      cy.intercept('GET', '/api/questions', {
        fixture: 'questions.json',
      }).as('getQuestions');
  
      cy.get('button').contains('Start Quiz').click();
      cy.wait('@getQuestions');
  
      // Answer all questions
      cy.fixture('questions.json').then((questions) => {
        questions.forEach((_, index) => {
          cy.get('button').contains((index + 1).toString()).click();
        });
      });
  
      // Verify the quiz is completed and score is displayed
      cy.get('h2').contains('Quiz Completed').should('exist');
      cy.get('.alert-success').should('contain.text', 'Your score:');
    });
  
    it('Should allow the user to retake the quiz', () => {
      cy.intercept('GET', '/api/questions', {
        fixture: 'questions.json',
      }).as('getQuestions');
  
      cy.get('button').contains('Start Quiz').click();
      cy.wait('@getQuestions');
  
      // Complete the quiz
      cy.fixture('questions.json').then((questions) => {
        questions.forEach((_, index) => {
          cy.get('button').contains((index + 1).toString()).click();
        });
      });
  
      // Click "Take New Quiz" button
      cy.get('button').contains('Take New Quiz').click();
  
      // Verify the quiz restarts
      cy.get('button').contains('Start Quiz').should('exist');
    });
  });