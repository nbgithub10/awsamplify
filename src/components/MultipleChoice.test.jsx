import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MultipleChoice from './MultipleChoice';

describe('MultipleChoice Component', () => {
  const mockQuestion = {
    id: 'test-1',
    question: 'What is the capital of France?',
    options: ['London', 'Paris', 'Berlin', 'Madrid'],
    correctAnswer: 1
  };

  const mockQuestionWithImage = {
    ...mockQuestion,
    id: 'test-2',
    image: '/engg_papers/images/2020/2020-hsc-engineering-studies_Page_03.png'
  };

  describe('Rendering', () => {
    it('should render question text', () => {
      render(
        <MultipleChoice 
          question={mockQuestion}
          selectedAnswer={null}
          onSelectAnswer={() => {}}
          showFeedback={false}
        />
      );

      expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
    });

    it('should render question ID', () => {
      render(
        <MultipleChoice 
          question={mockQuestion}
          selectedAnswer={null}
          onSelectAnswer={() => {}}
          showFeedback={false}
        />
      );

      expect(screen.getByText('Question test-1')).toBeInTheDocument();
    });

    it('should render all 4 options with correct labels', () => {
      render(
        <MultipleChoice 
          question={mockQuestion}
          selectedAnswer={null}
          onSelectAnswer={() => {}}
          showFeedback={false}
        />
      );

      expect(screen.getByText(/A\./)).toBeInTheDocument();
      expect(screen.getByText(/B\./)).toBeInTheDocument();
      expect(screen.getByText(/C\./)).toBeInTheDocument();
      expect(screen.getByText(/D\./)).toBeInTheDocument();
      
      expect(screen.getByText('London')).toBeInTheDocument();
      expect(screen.getByText('Paris')).toBeInTheDocument();
      expect(screen.getByText('Berlin')).toBeInTheDocument();
      expect(screen.getByText('Madrid')).toBeInTheDocument();
    });

    it('should render image when question has image property', () => {
      render(
        <MultipleChoice 
          question={mockQuestionWithImage}
          selectedAnswer={null}
          onSelectAnswer={() => {}}
          showFeedback={false}
        />
      );

      const img = screen.getByAltText('Question reference diagram');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', mockQuestionWithImage.image);
    });

    it('should not render image when question has no image property', () => {
      render(
        <MultipleChoice 
          question={mockQuestion}
          selectedAnswer={null}
          onSelectAnswer={() => {}}
          showFeedback={false}
        />
      );

      const img = screen.queryByAltText('Question reference diagram');
      expect(img).not.toBeInTheDocument();
    });
  });

  describe('Answer Selection', () => {
    it('should call onSelectAnswer when an option is clicked', () => {
      const mockSelectAnswer = vi.fn();
      
      render(
        <MultipleChoice 
          question={mockQuestion}
          selectedAnswer={null}
          onSelectAnswer={mockSelectAnswer}
          showFeedback={false}
        />
      );

      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[1]); // Click option B (Paris)

      expect(mockSelectAnswer).toHaveBeenCalledTimes(1);
      expect(mockSelectAnswer).toHaveBeenCalledWith(1);
    });

    it('should apply "selected" class to selected answer when no feedback', () => {
      const { container } = render(
        <MultipleChoice 
          question={mockQuestion}
          selectedAnswer={1}
          onSelectAnswer={() => {}}
          showFeedback={false}
        />
      );

      const buttons = container.querySelectorAll('.option-button');
      expect(buttons[1]).toHaveClass('selected');
    });

    it('should disable all buttons when showFeedback is true', () => {
      render(
        <MultipleChoice 
          question={mockQuestion}
          selectedAnswer={1}
          onSelectAnswer={() => {}}
          showFeedback={true}
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe('Feedback Display', () => {
    it('should show correct feedback when answer is correct', () => {
      render(
        <MultipleChoice 
          question={mockQuestion}
          selectedAnswer={1} // Paris - correct
          onSelectAnswer={() => {}}
          showFeedback={true}
        />
      );

      expect(screen.getByText(/✓ Correct!/)).toBeInTheDocument();
      expect(screen.getByText(/Correct Answer:/)).toBeInTheDocument();
      expect(screen.getByText(/B\. Paris/)).toBeInTheDocument();
    });

    it('should show incorrect feedback when answer is wrong', () => {
      render(
        <MultipleChoice 
          question={mockQuestion}
          selectedAnswer={0} // London - incorrect
          onSelectAnswer={() => {}}
          showFeedback={true}
        />
      );

      expect(screen.getByText(/✗ Incorrect/)).toBeInTheDocument();
      expect(screen.getByText(/Correct Answer:/)).toBeInTheDocument();
      expect(screen.getByText(/B\. Paris/)).toBeInTheDocument();
    });

    it('should not show feedback when showFeedback is false', () => {
      render(
        <MultipleChoice 
          question={mockQuestion}
          selectedAnswer={1}
          onSelectAnswer={() => {}}
          showFeedback={false}
        />
      );

      expect(screen.queryByText(/Correct!/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Incorrect/)).not.toBeInTheDocument();
    });

    it('should apply "correct" class to correct answer when feedback shown', () => {
      const { container } = render(
        <MultipleChoice 
          question={mockQuestion}
          selectedAnswer={1}
          onSelectAnswer={() => {}}
          showFeedback={true}
        />
      );

      const buttons = container.querySelectorAll('.option-button');
      expect(buttons[1]).toHaveClass('correct');
    });

    it('should apply "incorrect" class to wrong selected answer', () => {
      const { container } = render(
        <MultipleChoice 
          question={mockQuestion}
          selectedAnswer={0} // Wrong answer
          onSelectAnswer={() => {}}
          showFeedback={true}
        />
      );

      const buttons = container.querySelectorAll('.option-button');
      expect(buttons[0]).toHaveClass('incorrect');
      expect(buttons[1]).toHaveClass('correct'); // Still show correct answer
    });
  });

  describe('Edge Cases', () => {
    it('should handle question with correctAnswer as 0', () => {
      const questionWithZeroAnswer = {
        ...mockQuestion,
        correctAnswer: 0
      };

      render(
        <MultipleChoice 
          question={questionWithZeroAnswer}
          selectedAnswer={0}
          onSelectAnswer={() => {}}
          showFeedback={true}
        />
      );

      expect(screen.getByText(/✓ Correct!/)).toBeInTheDocument();
      expect(screen.getByText(/A\. London/)).toBeInTheDocument();
    });

    it('should handle question with correctAnswer as 3', () => {
      const questionWithLastAnswer = {
        ...mockQuestion,
        correctAnswer: 3
      };

      render(
        <MultipleChoice 
          question={questionWithLastAnswer}
          selectedAnswer={3}
          onSelectAnswer={() => {}}
          showFeedback={true}
        />
      );

      expect(screen.getByText(/✓ Correct!/)).toBeInTheDocument();
      expect(screen.getByText(/D\. Madrid/)).toBeInTheDocument();
    });

    it('should handle image loading error gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <MultipleChoice 
          question={mockQuestionWithImage}
          selectedAnswer={null}
          onSelectAnswer={() => {}}
          showFeedback={false}
        />
      );

      const img = screen.getByAltText('Question reference diagram');
      
      // Simulate image load error
      fireEvent.error(img);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to load image:',
        mockQuestionWithImage.image
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('should have buttons with role="button"', () => {
      render(
        <MultipleChoice 
          question={mockQuestion}
          selectedAnswer={null}
          onSelectAnswer={() => {}}
          showFeedback={false}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(4);
    });

    it('should have alt text for images', () => {
      render(
        <MultipleChoice 
          question={mockQuestionWithImage}
          selectedAnswer={null}
          onSelectAnswer={() => {}}
          showFeedback={false}
        />
      );

      const img = screen.getByAltText('Question reference diagram');
      expect(img).toBeInTheDocument();
    });
  });
});
