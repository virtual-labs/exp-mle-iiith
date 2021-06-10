In the previous experiment, we learned about how to generate a classifier, given models for each of the classes, using the Bayes Rule. The next goal is to learn such a classifier, automatically, given a set of labelled samples from each of the possible classes.  

Before doing this experiment, you should ensure that you have understood the previous experiment on Bayesian Classification as well as the experiment on Mean and Covariance estimateion from Data.  

The idea behind maximum likelihood parameter estimation is to determine the parameters that maximize the probability (likelihood) of the sample data. From a statistical point of view, the method of maximum likelihood is considered to be more robust (with some exceptions) and yields estimators with good statistical properties. In other words, MLE methods are versatile and apply to most models and to different types of data. In addition, they provide efficient methods for quantifying uncertainty through confidence bounds. Although the methodology for maximum likelihood estimation is simple, the implementation is mathematically intense. Using today's computer power, however, mathematical complexity is not a big obstacle.  

The MLE is an important type of estimator for the following reasons:  
 1. The MLE implements the likelihood principle.  
 2. MLEs are often simple and easy to compute.  
 3. MLEs have asymptotic optimality properties (consistency and efficiency).  
 4. MLEs are invariant under reparameterization.  
 5. If an efficient estimator exists, it is the MLE.  
 6. In signal detection with unknown parameters (composite hypothesis testing), MLEs are used in implementing the generalized likelihood ratio test (GLRT).  

