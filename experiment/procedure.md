

1. **Open the Simulation Page**

2. **Select a Distribution Type**

   * Use the dropdown labeled **Select Distribution** to choose the type of distribution you want to simulate.
   * Options include:

     * Gaussian (2D) with equal covariance matrices
     * Gaussian (2D) with different covariance matrices
     * Normal Distribution (1D)
     * Bernoulli Distribution (1D)
     * Poisson Distribution (1D)

3. **Learn About the Distribution**

   * Click the **info icon** (ℹ️) next to the distribution dropdown to open a popup modal that explains the selected distribution’s theory and properties.

4. **Adjust Sample Size**

   * Use the **Sample Size Per Class** slider to control how many data points will be generated for each class (from 20 to 200).
   * The current sample size value is displayed next to the slider.

5. **Set Distribution Parameters**

   * Depending on the distribution you select, dynamic parameter input controls will appear in the **Parameters** section.
   * Modify these inputs (means, covariances, probabilities, etc.) to shape the distributions according to your experiment.

6. **Generate Data**

   * Click **Generate Data** to create random samples based on the chosen distribution and parameters.
   * The generated data points will appear plotted on the canvas on the right.

7. **Estimate Parameters (MLE)**

   * Click **Estimate MLE** to compute the Maximum Likelihood Estimates of the distribution parameters from the generated data.
   * This updates the model parameters and the visualization accordingly.

8. **Show Classifier Decision Boundaries**

   * Click **Show Classifier** to display the decision boundaries calculated from the model parameters.
   * This helps visualize how the classifier distinguishes between classes.

9. **Animate Data Points**

   * Click the **Play button** (▶️) to animate the data points being plotted one by one, helping you visually understand the data generation process.

10. **View Performance Metrics**

    * The **Classifier Performance** panel updates dynamically with accuracy, Precision, Recall & F1 Score
    * Use these to evaluate how well the classifier is performing on the generated data.


