# Main CSS Documentation

This documentation provides an overview of the CSS styling used in the Generative Classifier Simulation project.

## Table of Contents
1. [Overview](#overview)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Layout Structure](#layout-structure)
5. [Component Styling](#component-styling)
6. [Responsive Design](#responsive-design)
7. [Usage Guidelines](#usage-guidelines)

## Overview

The `main.css` file implements a clean, modern interface for the Generative Classifier Simulation tool. It uses a combination of CSS variables, flexbox layouts, and responsive design principles to create an intuitive user experience.

## Color Palette

The design uses a carefully selected color palette defined as CSS variables:

```css
:root {
  --primary: #3a86ff;         /* Main blue color */
  --primary-light: #4895ff;   /* Lighter version of primary */
  --primary-dark: #2c6dc9;    /* Darker version of primary */
  --secondary: #ff6b6b;       /* Red accent color */
  --secondary-light: #ff8a8a; /* Lighter version of secondary */
  --accent: #4cc9f0;          /* Light blue accent color */
  --accent-light: #72d6f5;    /* Lighter version of accent */
  --success: #38b000;         /* Green for success indicators */
  --warning: #ffbe0b;         /* Yellow for warnings/notifications */
  --neutral-light: #f0f2f5;   /* Light gray for backgrounds */
  --neutral-medium: #dde1e6;  /* Medium gray for borders */
  --neutral-dark: #8d99ae;    /* Darker gray for secondary text */
  --text-dark: #212529;       /* Almost black for primary text */
  --text-medium: #495057;     /* Dark gray for secondary text */
  --text-light: #ffffff;      /* White for text on dark backgrounds */
  --class1-color: #ff6b6b;    /* Red for Class 1 data points */
  --class2-color: #4cc9f0;    /* Blue for Class 2 data points */
  --decision-color: #38b000;  /* Green for decision boundaries */
}
```

These color variables should be used consistently throughout the application to maintain visual coherence.

## Typography

The design uses the Roboto font family as the primary typeface:

- **Body Text**: Roboto (regular, 400 weight)
- **Headings**: Roboto (bold, 700 weight)
- **Secondary Text**: Roboto (light, 300 weight)

Font sizes are set in em units to maintain proper scaling across different screen sizes.

## Layout Structure

The layout is organized using the following structure:

1. **Header** - Contains the title and introduction text
2. **Controls Section** - Houses all interactive elements for the simulation
3. **Main Content** - Displays the canvas and explanation panel side by side
4. **Footer** - Contains credits and helpful links

The layout uses Flexbox extensively for alignment and responsive behavior.

## Component Styling

### Control Elements

Form controls (buttons, inputs, selects) follow these style guidelines:
- Border radius of 6px for rounded corners
- Consistent padding (10px 16px for buttons, 10px for inputs)
- Hover and focus states with subtle animations
- Box shadows for depth and visual hierarchy

Example:
```css
.control-row button {
  background-color: var(--primary);
  color: var(--text-light);
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.2s ease;
}
```

### Canvas and Visual Elements

The simulation canvas has a clean border and subtle shadow:
```css
#simCanvas {
  border: 2px solid var(--primary);
  background-color: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
```

### Modal System

The application includes a modal system for displaying additional information:
- Semi-transparent overlay background
- Centered modal window with rounded corners
- Smooth animations for opening/closing
- Responsive sizing that works on all devices

## Responsive Design

The stylesheet includes responsive breakpoints to adapt the layout for different screen sizes:

- **Desktop**: Full side-by-side layout (main content and explanation panels)
- **Tablet/Mobile**: Stacked layout with optimized spacing and control dimensions

Media queries:
```css
@media (min-width: 768px) {
  /* Desktop styles */
}

@media (max-width: 768px) {
  /* Mobile/tablet styles */
}
```

## Usage Guidelines

To maintain design consistency when extending this application:

1. Always use the defined CSS variables for colors
2. Maintain consistent spacing (multiples of 5px are used throughout)
3. Preserve the responsive layout structure when adding new components
4. Follow the established patterns for interactive elements (hover states, transitions)
5. Use the existing modal system for additional information displays

When adding new components, reference existing similar components for styling cues to ensure visual coherence.