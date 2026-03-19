import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SectionSelector from './SectionSelector';

describe('SectionSelector Component', () => {
  const mockOnSectionSelect = vi.fn();

  beforeEach(() => {
    mockOnSectionSelect.mockClear();
  });

  describe('Main View - Initial State', () => {
    it('should render main title', () => {
      render(<SectionSelector onSectionSelect={mockOnSectionSelect} />);
      expect(screen.getByText('HSC Engineering Quiz')).toBeInTheDocument();
    });

    it('should render instructions text', () => {
      render(<SectionSelector onSectionSelect={mockOnSectionSelect} />);
      expect(screen.getByText('Select a section to begin your practice quiz')).toBeInTheDocument();
    });

    it('should render toggle checkbox checked by default', () => {
      render(<SectionSelector onSectionSelect={mockOnSectionSelect} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('should render toggle label text', () => {
      render(<SectionSelector onSectionSelect={mockOnSectionSelect} />);
      expect(screen.getByText('Show all questions on single page')).toBeInTheDocument();
    });

    it('should render all 3 main menu buttons', () => {
      render(<SectionSelector onSectionSelect={mockOnSectionSelect} />);
      
      expect(screen.getByText('AI Generated Content')).toBeInTheDocument();
      expect(screen.getByText('Past Papers')).toBeInTheDocument();
      expect(screen.getByText('Studocu - Engineering Materials')).toBeInTheDocument();
    });
  });

  describe('Toggle Functionality', () => {
    it('should toggle checkbox when clicked', () => {
      render(<SectionSelector onSectionSelect={mockOnSectionSelect} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
      
      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
      
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it('should pass showAllQuestions=true when checkbox is checked', () => {
      render(<SectionSelector onSectionSelect={mockOnSectionSelect} />);
      
      const pastPapersButton = screen.getByText('Past Papers (2020-2025) (22)');
      fireEvent.click(pastPapersButton);
      
      expect(mockOnSectionSelect).toHaveBeenCalledWith('pastPapers', true);
    });

    it('should pass showAllQuestions=false when checkbox is unchecked', () => {
      render(<SectionSelector onSectionSelect={mockOnSectionSelect} />);
      
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox); // Uncheck
      
      const pastPapersButton = screen.getByText('Past Papers (2020-2025) (22)');
      fireEvent.click(pastPapersButton);
      
      expect(mockOnSectionSelect).toHaveBeenCalledWith('pastPapers', false);
    });
  });

  describe('Main Menu Navigation', () => {
    it('should call onSectionSelect with "pastPapers" when Past Papers button clicked', () => {
      render(<SectionSelector onSectionSelect={mockOnSectionSelect} />);
      
      const button = screen.getByText('Past Papers (2020-2025) (22)');
      fireEvent.click(button);
      
      expect(mockOnSectionSelect).toHaveBeenCalledWith('pastPapers', true);
      expect(mockOnSectionSelect).toHaveBeenCalledTimes(1);
    });

    it('should navigate to AI Generated view when button clicked', () => {
      render(<SectionSelector onSectionSelect={mockOnSectionSelect} />);
      
      const button = screen.getByText('AI Generated Content');
      fireEvent.click(button);
      
      // Should show AI Generated Content title
      expect(screen.getByText('AI Generated Content')).toBeInTheDocument();
      expect(screen.getByText('Choose a section to practice')).toBeInTheDocument();
    });

    it('should navigate to Studocu view when button clicked', () => {
      render(<SectionSelector onSectionSelect={mockOnSectionSelect} />);
      
      const button = screen.getByText('Studocu - Engineering Materials');
      fireEvent.click(button);
      
      // Should show Studocu title
      expect(screen.getByText('Select Engineering Topic')).toBeInTheDocument();
      expect(screen.getByText('Choose a topic from Engineering Materials')).toBeInTheDocument();
    });
  });

  describe('AI Generated Content View', () => {
    beforeEach(() => {
      render(<SectionSelector onSectionSelect={mockOnSectionSelect} />);
      const button = screen.getByText('AI Generated Content');
      fireEvent.click(button);
    });

    it('should render back button', () => {
      expect(screen.getByText('← Back to Main Menu')).toBeInTheDocument();
    });

    it('should render all AI generated sections with counts', () => {
      expect(screen.getByText('Civil Structures (25)')).toBeInTheDocument();
      expect(screen.getByText('Personal & Public Transport (25)')).toBeInTheDocument();
      expect(screen.getByText('All Questions (72)')).toBeInTheDocument();
    });

    it('should call onSectionSelect with correct section when AI section clicked', () => {
      const civilButton = screen.getByText('Civil Structures (25)');
      fireEvent.click(civilButton);
      
      expect(mockOnSectionSelect).toHaveBeenCalledWith('civil', true);
    });

    it('should navigate back to main menu when back button clicked', () => {
      const backButton = screen.getByText('← Back to Main Menu');
      fireEvent.click(backButton);
      
      // Should show main menu again
      expect(screen.getByText('HSC Engineering Quiz')).toBeInTheDocument();
    });
  });

  describe('Studocu View', () => {
    beforeEach(() => {
      render(<SectionSelector onSectionSelect={mockOnSectionSelect} />);
      const button = screen.getByText('Studocu - Engineering Materials');
      fireEvent.click(button);
    });

    it('should render back button', () => {
      expect(screen.getByText('← Back to Main Menu')).toBeInTheDocument();
    });

    it('should render all category titles', () => {
      expect(screen.getByText('MATERIALS')).toBeInTheDocument();
      expect(screen.getByText('CIVIL ENGINEERING')).toBeInTheDocument();
      expect(screen.getByText('TESTING METHODS')).toBeInTheDocument();
      expect(screen.getByText('ADVANCED MATERIALS')).toBeInTheDocument();
      expect(screen.getByText('MANUFACTURING')).toBeInTheDocument();
      expect(screen.getByText('ENGINEERING APPLICATIONS')).toBeInTheDocument();
    });

    it('should render sample topics with counts from each category', () => {
      // Materials
      expect(screen.getByText('Metals (22)')).toBeInTheDocument();
      expect(screen.getByText('Ceramics (13)')).toBeInTheDocument();
      
      // Civil Engineering
      expect(screen.getByText('Crack Theory (22)')).toBeInTheDocument();
      expect(screen.getByText('Corrosion (25)')).toBeInTheDocument();
      
      // Manufacturing
      expect(screen.getByText('Heat Treatment (33)')).toBeInTheDocument();
    });

    it('should call onSectionSelect with prefixed studocu ID when topic clicked', () => {
      const metalsButton = screen.getByText('Metals (22)');
      fireEvent.click(metalsButton);
      
      expect(mockOnSectionSelect).toHaveBeenCalledWith('studocu-metals', true);
    });

    it('should navigate back to main menu when back button clicked', () => {
      const backButton = screen.getByText('← Back to Main Menu');
      fireEvent.click(backButton);
      
      // Should show main menu again
      expect(screen.getByText('HSC Engineering Quiz')).toBeInTheDocument();
    });
  });

  describe('Toggle State Persistence Across Views', () => {
    it('should maintain toggle state when navigating to AI Generated and back', () => {
      render(<SectionSelector onSectionSelect={mockOnSectionSelect} />);
      
      // Uncheck toggle
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
      
      // Navigate to AI Generated
      const aiButton = screen.getByText('AI Generated Content');
      fireEvent.click(aiButton);
      
      // Navigate back
      const backButton = screen.getByText('← Back to Main Menu');
      fireEvent.click(backButton);
      
      // Toggle should still be unchecked
      const checkboxAfter = screen.getByRole('checkbox');
      expect(checkboxAfter).not.toBeChecked();
    });

    it('should use current toggle state when selecting AI section', () => {
      render(<SectionSelector onSectionSelect={mockOnSectionSelect} />);
      
      // Uncheck toggle
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      
      // Navigate to AI Generated
      const aiButton = screen.getByText('AI Generated Content');
      fireEvent.click(aiButton);
      
      // Select Civil section
      const civilButton = screen.getByText('Civil Structures (25)');
      fireEvent.click(civilButton);
      
      // Should pass false for showAllQuestions
      expect(mockOnSectionSelect).toHaveBeenCalledWith('civil', false);
    });

    it('should use current toggle state when selecting Studocu topic', () => {
      render(<SectionSelector onSectionSelect={mockOnSectionSelect} />);
      
      // Uncheck toggle
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      
      // Navigate to Studocu
      const studocuButton = screen.getByText('Studocu - Engineering Materials');
      fireEvent.click(studocuButton);
      
      // Select a topic
      const metalsButton = screen.getByText('Metals (22)');
      fireEvent.click(metalsButton);
      
      // Should pass false for showAllQuestions
      expect(mockOnSectionSelect).toHaveBeenCalledWith('studocu-metals', false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid navigation between views', () => {
      render(<SectionSelector onSectionSelect={mockOnSectionSelect} />);
      
      // Navigate to AI Generated
      fireEvent.click(screen.getByText('AI Generated Content'));
      expect(screen.getByText('Civil Structures (25)')).toBeInTheDocument();
      
      // Navigate back
      fireEvent.click(screen.getByText('← Back to Main Menu'));
      expect(screen.getByText('HSC Engineering Quiz')).toBeInTheDocument();
      
      // Navigate to Studocu
      fireEvent.click(screen.getByText('Studocu - Engineering Materials'));
      expect(screen.getByText('MATERIALS')).toBeInTheDocument();
      
      // Navigate back
      fireEvent.click(screen.getByText('← Back to Main Menu'));
      expect(screen.getByText('HSC Engineering Quiz')).toBeInTheDocument();
    });

    it('should not call onSectionSelect when just navigating between views', () => {
      render(<SectionSelector onSectionSelect={mockOnSectionSelect} />);
      
      // Navigate to AI Generated
      fireEvent.click(screen.getByText('AI Generated Content'));
      
      // Navigate back
      fireEvent.click(screen.getByText('← Back to Main Menu'));
      
      // onSectionSelect should not have been called
      expect(mockOnSectionSelect).not.toHaveBeenCalled();
    });
  });
});
