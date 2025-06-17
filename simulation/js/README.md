# MLE Generative Classifier Simulation

This interactive web application demonstrates maximum likelihood estimation (MLE) and generative classifiers across multiple probability distributions. It visualizes how different distributions affect decision boundaries and classification performance.

## Features

- **Multiple Probability Distributions**: Explore five different distribution types:
  - Gaussian (2D) with equal covariance
  - Gaussian (2D) with different covariance
  - Normal (1D)
  - Bernoulli (1D)
  - Poisson (1D)

- **Interactive Learning**:
  - Generate random data samples
  - Estimate maximum likelihood parameters
  - Visualize decision boundaries
  - Observe classification performance metrics
  - Animate data generation process

- **Performance Metrics**:
  - Accuracy
  - Precision
  - Recall
  - F1 Score

## How to Use

1. **Select a Distribution**: Choose from the dropdown menu
2. **Adjust Sample Size**: Use the slider to increase or decrease the number of points
3. **Generate Data**: Click the "Generate Data" button to create random samples
4. **Estimate Parameters**: Click "Estimate MLE" to calculate maximum likelihood estimators
5. **Visualize Classifier**: Click "Show Classifier" to display the decision boundary
6. **Performance Analysis**: Review metrics to evaluate classifier performance

## Technical Details

The simulation demonstrates several key concepts in statistical machine learning:

- **Maximum Likelihood Estimation (MLE)**: The application estimates parameters that maximize the likelihood of observing the generated data
- **Generative Models**: Data is generated according to class-conditional probability distributions
- **Decision Boundaries**: The simulation shows how different distributions lead to different boundary shapes
- **Classification Metrics**: Performance is measured using standard evaluation metrics

## Implementation Notes

- The canvas element displays data points, estimated means, and decision boundaries
- For 2D Gaussian distributions, the covariance structure determines boundary type (linear or quadratic)
- For 1D distributions, data is visualized with slight vertical jitter for better visibility
- Dark mode support enhances visualization in different environments

## Educational Context

This tool is designed to help learners:
- Understand the relationship between data distributions and decision boundaries
- Visualize how parameter estimation affects classification
- Explore the impact of sample size on estimation accuracy
- Compare performance across different probability models

## Acknowledgments

Created as part of the DASS project for conveying principles of machine learning and statistical inference.