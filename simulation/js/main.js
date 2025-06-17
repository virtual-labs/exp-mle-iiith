// Global variables and DOM elements
const canvas = document.getElementById("simCanvas");
const ctx = canvas.getContext("2d");
const resultsDiv = document.getElementById("results");
const distributionSelect = document.getElementById("distributionSelect");
const sampleSizeSlider = document.getElementById("sampleSize");
const sampleSizeValue = document.getElementById("sampleSizeValue");
const explanationContent = document.getElementById("explanationContent");
const performanceMetrics = document.getElementById("performanceMetrics");
const modalOverlay = document.getElementById("modalOverlay");
const infoModal = document.getElementById("infoModal");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const infoBtn = document.getElementById("infoBtn");
const closeModal = document.getElementById("closeModal");
const tutorialLink = document.getElementById("tutorialLink");
const animateBtn = document.getElementById("animateBtn");

let classData = { class1: [], class2: [] };
let mleEstimates = { class1: {}, class2: {} };
let sampleSize = parseInt(sampleSizeSlider.value);
let animationId = null;

// Initialize the application
function init() {
  // Load dark mode preference from local storage
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    
  }
  
  // Make canvas responsive
  resizeCanvas();
  
  // Set up event listeners
  setupEventListeners();
  
  // Generate initial data
  generateData();
  
  // Update explanation panel
  updateExplanationPanel();
}

// Make canvas responsive
function resizeCanvas() {
  const container = document.getElementById("output");
  const containerWidth = container.clientWidth;
  
  // If on a mobile screen, adjust canvas dimensions
  if (window.innerWidth <= 767) {
    const aspectRatio = canvas.height / canvas.width;
    const newWidth = Math.min(containerWidth - 20, 600); // Accounting for padding
    const newHeight = newWidth * aspectRatio;
    
    canvas.style.width = newWidth + 'px';
    canvas.style.height = newHeight + 'px';
    
    // Important: maintain the canvas's internal dimensions for correct rendering
    // We don't change canvas.width and canvas.height to preserve the coordinate system
  } else {
    // Reset to original dimensions on larger screens
    canvas.style.width = '';
    canvas.style.height = '';
  }
  
  // Force a redraw to ensure the canvas looks crisp
  if (Object.keys(classData.class1).length > 0 || Object.keys(classData.class2).length > 0) {
    drawData();
  }
}

// Set up all event listeners
function setupEventListeners() {
  // Dark mode toggle

  // Window resize event
  window.addEventListener("resize", () => {
    resizeCanvas();
    // Redraw canvas content after resize
    if (classData.class1.length > 0 || classData.class2.length > 0) {
      drawData();
    }
  });
  
  // Distribution select change
  distributionSelect.addEventListener("change", updateExplanationPanel);
  
  // Sample size slider
  sampleSizeSlider.addEventListener("input", () => {
    sampleSize = parseInt(sampleSizeSlider.value);
    sampleSizeValue.textContent = sampleSize;
  });
  
  // Button event listeners
  document.getElementById("generateDataBtn").addEventListener("click", () => {
    mleEstimates = { class1: {}, class2: {} };
    generateData();
  });
  
  document.getElementById("estimateMLEBtn").addEventListener("click", estimateMLE);
  document.getElementById("markAllBtn").addEventListener("click", markAll);
  
  // Info button
  infoBtn.addEventListener("click", showInfoModal);
  
  // Close modal button
  closeModal.addEventListener("click", () => {
    modalOverlay.classList.remove("active");
  });
  
  // Tutorial link
  tutorialLink.addEventListener("click", (e) => {
    e.preventDefault();
    showTutorial();
  });
  
  // Animation button
  animateBtn.addEventListener("click", toggleAnimation);
  
  // Canvas mouse move and touch
  canvas.addEventListener("mousemove", updateCoordinates);
  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault(); // Prevent scrolling when touching the canvas
    if (e.touches.length > 0) {
      updateCoordinates(e.touches[0]);
    }
  });
  
  // Canvas touch events for mobile devices
  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault(); // Prevent default touch behavior
    // Handle touch start if needed for future functionality
  });

  canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    // Handle touch end if needed for future functionality
  });
}

// Update coordinates display on canvas
function updateCoordinates(e) {
  const rect = canvas.getBoundingClientRect();
  // Get canvas scaling factor
  const scaleX = canvas.width / canvas.clientWidth;
  const scaleY = canvas.height / canvas.clientHeight;
  
  // Calculate coordinates considering scaling
  const x = Math.floor((e.clientX - rect.left) * scaleX);
  const y = Math.floor((e.clientY - rect.top) * scaleY);
  
  // Clear a small area at the bottom to show coordinates
  ctx.clearRect(0, canvas.height - 25, 120, 25);
  ctx.fillStyle = document.body.classList.contains('dark-mode') ? "#e0e0e0" : "#424242";
  ctx.font = "14px Roboto";
  ctx.fillText(`(${x}, ${y})`, 5, canvas.height - 8);
}

// Show info modal with distribution-specific content
function showInfoModal() {
  const mode = distributionSelect.value;
  modalTitle.textContent = getDistributionTitle(mode);
  modalContent.innerHTML = getDistributionInfo(mode);
  modalOverlay.classList.add("active");
}

// Get distribution title
function getDistributionTitle(mode) {
  switch(mode) {
    case "gaussian_equal": return "Gaussian Distribution (Equal Covariance)";
    case "gaussian_diff": return "Gaussian Distribution (Different Covariance)";
    case "normal": return "Normal Distribution (1D)";
    case "bernoulli": return "Bernoulli Distribution (1D)";
    case "poisson": return "Poisson Distribution (1D)";
    default: return "Distribution Information";
  }
}

// Get distribution information HTML content
function getDistributionInfo(mode) {
  switch(mode) {
    case "gaussian_equal":
      return `
        <p>The multivariate Gaussian distribution with equal covariance matrices is a key distribution in machine learning.</p>
        <h4>Properties</h4>
        <ul>
          <li>The decision boundary between two classes is linear</li>
          <li>The formula for the probability density function is: 
            <code>p(x) = (1/√(2π|Σ|)) * exp(-0.5 * (x-μ)ᵀΣ⁻¹(x-μ))</code></li>
          <li>When the covariance matrices are equal, the quadratic terms cancel out</li>
        </ul>
        <h4>Maximum Likelihood Estimation</h4>
        <p>The MLEs for the parameters are:</p>
        <ul>
          <li>Mean (μ): Sample mean of the data points</li>
          <li>Covariance (Σ): Sample covariance matrix</li>
        </ul>
      `;
    case "gaussian_diff":
      return `
        <p>The multivariate Gaussian distribution with different covariance matrices results in more complex decision boundaries.</p>
        <h4>Properties</h4>
        <ul>
          <li>The decision boundary between two classes is quadratic</li>
          <li>Different covariance matrices allow for more flexible shapes of each class distribution</li>
          <li>This provides a more powerful model than equal covariance cases</li>
        </ul>
        <h4>Maximum Likelihood Estimation</h4>
        <p>The MLEs for the parameters are:</p>
        <ul>
          <li>Mean (μ): Sample mean of the data points</li>
          <li>Covariance (Σ): Sample covariance matrix computed separately for each class</li>
        </ul>
      `;
    case "normal":
      return `
        <p>The normal (Gaussian) distribution in one dimension is the most common continuous probability distribution.</p>
        <h4>Properties</h4>
        <ul>
          <li>Bell-shaped curve that is symmetric around its mean</li>
          <li>Defined by two parameters: mean (μ) and variance (σ²)</li>
          <li>The formula for the probability density function is: 
            <code>p(x) = (1/σ√(2π)) * exp(-(x-μ)²/(2σ²))</code></li>
        </ul>
        <h4>Maximum Likelihood Estimation</h4>
        <p>The MLEs for the parameters are:</p>
        <ul>
          <li>Mean (μ): Sample mean of the data</li>
          <li>Variance (σ²): Sample variance of the data</li>
        </ul>
      `;
    case "bernoulli":
      return `
        <p>The Bernoulli distribution models binary outcomes (success/failure) with probability p.</p>
        <h4>Properties</h4>
        <ul>
          <li>Models a single binary outcome (0 or 1)</li>
          <li>Has a single parameter p (probability of success)</li>
          <li>The probability mass function is: 
            <code>P(X=1) = p, P(X=0) = 1-p</code></li>
        </ul>
        <h4>Maximum Likelihood Estimation</h4>
        <p>The MLE for the parameter p is:</p>
        <ul>
          <li>p = number of successes / total number of trials</li>
        </ul>
      `;
    case "poisson":
      return `
        <p>The Poisson distribution models the number of events occurring in a fixed interval of time or space.</p>
        <h4>Properties</h4>
        <ul>
          <li>Models count data (0, 1, 2, ...)</li>
          <li>Has a single parameter λ (rate parameter)</li>
          <li>The probability mass function is: 
            <code>P(X=k) = (λᵏ * e⁻λ) / k!</code></li>
          <li>Mean and variance are both equal to λ</li>
        </ul>
        <h4>Maximum Likelihood Estimation</h4>
        <p>The MLE for the parameter λ is:</p>
        <ul>
          <li>λ = sample mean of the counts</li>
        </ul>
      `;
    default:
      return "<p>Select a distribution to see more information.</p>";
  }
}

// Update explanation panel based on selected distribution
function updateExplanationPanel() {
  const mode = distributionSelect.value;
  let content = "";
  
  switch(mode) {
    case "gaussian_equal":
      content = `
        <p>This simulation shows two classes generated from 2D Gaussian distributions with <strong>equal covariance matrices</strong>.</p>
        <p>Key points:</p>
        <ul>
          <li>The decision boundary is a straight line (linear)</li>
          <li>Equal covariance matrices mean both classes have the same shape</li>
          <li>The MLE estimates the means of each class</li>
        </ul>
        <p>Try generating data and observing how the decision boundary forms at the midpoint between class means.</p>
      `;
      break;
    case "gaussian_diff":
      content = `
        <p>This simulation shows two classes generated from 2D Gaussian distributions with <strong>different covariance matrices</strong>.</p>
        <p>Key points:</p>
        <ul>
          <li>The decision boundary is quadratic (curved)</li>
          <li>Different covariance matrices allow for different shapes for each class</li>
          <li>The classifier accounts for both mean and covariance</li>
        </ul>
        <p>Notice how the decision boundary curves to optimize classification between the differently shaped distributions.</p>
      `;
      break;
    case "normal":
      content = `
        <p>This simulation shows two classes generated from 1D Normal distributions.</p>
        <p>Key points:</p>
        <ul>
          <li>Each class is distributed along the x-axis</li>
          <li>The decision boundary is the midpoint between the two means</li>
          <li>Classification errors occur where the distributions overlap</li>
        </ul>
        <p>Try generating data with different sample sizes to see how the MLE estimates change.</p>
      `;
      break;
    case "bernoulli":
      content = `
        <p>This simulation shows two classes generated from Bernoulli distributions.</p>
        <p>Key points:</p>
        <ul>
          <li>Each data point can only be at one of two positions (0 or 1)</li>
          <li>The MLE estimate is the proportion of 1s</li>
          <li>For visualization, the positions are mapped to 150 (0) and 450 (1)</li>
        </ul>
        <p>Notice the discrete nature of the data and how the decision boundary works.</p>
      `;
      break;
    case "poisson":
      content = `
        <p>This simulation shows two classes generated from Poisson distributions.</p>
        <p>Key points:</p>
        <ul>
          <li>Data represents counts (0, 1, 2, ...)</li>
          <li>The MLE estimate is the average count</li>
          <li>The decision boundary separates regions where one distribution has higher probability</li>
        </ul>
        <p>Observe how the classifier handles data that can only take integer values.</p>
      `;
      break;
  }
  
  explanationContent.innerHTML = content;
}

// Show tutorial modal
function showTutorial() {
  modalTitle.textContent = "Using the Generative Classifier Simulation";
  modalContent.innerHTML = `
    <h4>Getting Started</h4>
    <ol>
      <li>Select a distribution type from the dropdown menu</li>
      <li>Adjust the sample size using the slider</li>
      <li>Click "Generate Data" to create random samples</li>
      <li>Click "Estimate MLE" to calculate maximum likelihood estimators</li>
      <li>Click "Show Classifier" to visualize the decision boundary</li>
    </ol>
    
    <h4>Understanding the Visualization</h4>
    <ul>
      <li>Red points represent Class 1</li>
      <li>Purple points represent Class 2</li>
      <li>Highlighted points show the estimated means</li>
      <li>The green line is the decision boundary</li>
    </ul>
    
    <h4>Additional Features</h4>
    <ul>
      <li>Click the info button to learn about each distribution</li>
      <li>Use the animation button to see data generation in action</li>
      <li>Toggle dark mode for different visual preferences</li>
      <li>Performance metrics show classifier accuracy</li>
    </ul>
  `;
  modalOverlay.classList.add("active");
}

// Toggle animation
function toggleAnimation() {
  if (animationId) {
    // Stop animation
    cancelAnimationFrame(animationId);
    animationId = null;
    animateBtn.innerHTML = '<i class="fas fa-play"></i>';
  } else {
    // Start animation
    animateBtn.innerHTML = '<i class="fas fa-pause"></i>';
    animateData();
  }
}

// Animate data generation
function animateData() {
  classData.class1 = [];
  classData.class2 = [];
  mleEstimates = { class1: {}, class2: {} };
  
  let count = 0;
  const totalPoints = sampleSize;
  
  function addPoint() {
    if (count >= totalPoints) {
      animateBtn.innerHTML = '<i class="fas fa-play"></i>';
      animationId = null;
      estimateMLE();
      markAll();
      return;
    }
    
    // Add one point to each class
    const mode = distributionSelect.value;
    if (mode === "gaussian_equal") {
      const params = {
        class1: { mean: { x: 150, y: 150 }, variance: 400 },
        class2: { mean: { x: 450, y: 250 }, variance: 400 }
      };
      classData.class1.push(generateGaussianSample(params.class1.mean, params.class1.variance));
      classData.class2.push(generateGaussianSample(params.class2.mean, params.class2.variance));
    } else if (mode === "gaussian_diff") {
      const params = {
        class1: { 
          mean: { x: 180, y: 180 },
          covariance: { a: 500, b: 120, c: 300 }
        },
        class2: { 
          mean: { x: 400, y: 280 },
          covariance: { a: 300, b: -80, c: 500 }
        }
      };
      classData.class1.push(generateGaussianSample(params.class1.mean, params.class1.covariance));
      classData.class2.push(generateGaussianSample(params.class2.mean, params.class2.covariance));
    } else if (mode === "normal") {
      const params = {
        class1: { mean: 150, variance: 400 },
        class2: { mean: 450, variance: 400 }
      };
      let x1 = params.class1.mean + Math.sqrt(params.class1.variance) * randnBm();
      let x2 = params.class2.mean + Math.sqrt(params.class2.variance) * randnBm();
      classData.class1.push({ x: x1, y: canvas.height/2 + (Math.random()-0.5)*10 });
      classData.class2.push({ x: x2, y: canvas.height/2 + (Math.random()-0.5)*10 });
    } else if (mode === "bernoulli") {
      const params = {
        class1: { p: 0.3 },
        class2: { p: 0.7 }
      };
      let outcome1 = (Math.random() < params.class1.p) ? 1 : 0;
      let outcome2 = (Math.random() < params.class2.p) ? 1 : 0;
      let x1 = outcome1 === 1 ? 450 : 150;
      let x2 = outcome2 === 1 ? 450 : 150;
      classData.class1.push({ x: x1, y: canvas.height/2 + (Math.random()-0.5)*10 });
      classData.class2.push({ x: x2, y: canvas.height/2 + (Math.random()-0.5)*10 });
    } else if (mode === "poisson") {
      const margin = 100;
      const scale = 50;
      const params = {
        class1: { lambda: 2 },
        class2: { lambda: 5 }
      };
      let outcome1 = randPoisson(params.class1.lambda);
      let outcome2 = randPoisson(params.class2.lambda);
      let x1 = margin + outcome1 * scale;
      let x2 = margin + outcome2 * scale;
      classData.class1.push({ x: x1, y: canvas.height/2 + (Math.random()-0.5)*10 });
      classData.class2.push({ x: x2, y: canvas.height/2 + (Math.random()-0.5)*10 });
    }
    
    drawData();
    count++;
    
    // If enough points, estimate MLEs and update
    if (count % 5 === 0) {
      estimateMLE();
    }
    
    animationId = requestAnimationFrame(addPoint);
  }
  
  addPoint();
}

// Calculate and display performance metrics
// Calculate and display performance metrics
function calculatePerformanceMetrics() {
  const mode = distributionSelect.value;
  let is1D = (mode === "normal" || mode === "bernoulli" || mode === "poisson");

  // Check if MLE estimates are available
  if (!mleEstimates.class1.mean || !mleEstimates.class2.mean ||
      (mode === "gaussian_diff" && (!mleEstimates.class1.covariance || !mleEstimates.class2.covariance)))
  {
      performanceMetrics.innerHTML = "Generate data & estimate MLEs to see metrics.";
      // Clear existing metrics if estimates are missing
      document.querySelectorAll('.metric-item .metric-value').forEach(el => el.textContent = '-');
      return;
  }

  // --- Helper Function: Classify a single point ---
  function classify(point) {
      if (is1D) {
          // Simple midpoint boundary for 1D cases
          const m1x = mleEstimates.class1.mean.meanX;
          const m2x = mleEstimates.class2.mean.meanX;
          // Handle case where means are identical (boundary is arbitrary but consistent)
          if (Math.abs(m1x - m2x) < 1e-6) return 1; // Default to class 1 if means are the same
          const boundaryX = (m1x + m2x) / 2;
          // Classify based on which side of the boundary the point falls
          // If m1 < m2, points < boundaryX are class 1. If m1 > m2, points > boundaryX are class 1.
          return ((m1x < m2x && point.x < boundaryX) || (m1x > m2x && point.x > boundaryX)) ? 1 : 2;

      } else if (mode === "gaussian_equal") {
          // Closest mean classification for equal covariance
          const m1 = { x: mleEstimates.class1.mean.meanX, y: mleEstimates.class1.mean.meanY };
          const m2 = { x: mleEstimates.class2.mean.meanX, y: mleEstimates.class2.mean.meanY };

          // Calculate squared Euclidean distances (sqrt not needed for comparison)
          const d1_sq = Math.pow(point.x - m1.x, 2) + Math.pow(point.y - m1.y, 2);
          const d2_sq = Math.pow(point.x - m2.x, 2) + Math.pow(point.y - m2.y, 2);

          return d1_sq < d2_sq ? 1 : 2;

      } else if (mode === "gaussian_diff") {
           // Use the full quadratic discriminant function, matching markAll
           const m1 = { x: mleEstimates.class1.mean.meanX, y: mleEstimates.class1.mean.meanY };
           const m2 = { x: mleEstimates.class2.mean.meanX, y: mleEstimates.class2.mean.meanY };

           // Re-use helper functions for consistency (or define them locally if preferred)
           function covDet(cov) {
               const det = cov.a * cov.c - cov.b * cov.b;
               return Math.max(det, 1e-6); // Ensure positive determinant
           }

           function covInverse(cov) {
               const det = covDet(cov);
               // Prevent division by zero if det is extremely small
               if (Math.abs(det) < 1e-9) {
                  console.warn("Near-zero determinant encountered in covariance inverse calculation.");
                  // Return an identity-like matrix or handle as error? For now, return null/undefined to signal issue.
                  return null;
               }
               return {
                   a: cov.c / det,
                   b: -cov.b / det,
                   c: cov.a / det
               };
           }

           const cov1Inv = covInverse(mleEstimates.class1.covariance);
           const cov2Inv = covInverse(mleEstimates.class2.covariance);

           // Check if inverse calculation failed
           if (!cov1Inv || !cov2Inv) {
               console.error("Failed to calculate covariance inverse for metrics.");
               // Return a default classification or handle error
               return 1; // Default classification if calculation fails
           }

           const logDet1 = Math.log(covDet(mleEstimates.class1.covariance));
           const logDet2 = Math.log(covDet(mleEstimates.class2.covariance));

           const dx1 = point.x - m1.x;
           const dy1 = point.y - m1.y;
           // Mahalanobis distance squared for class 1: (x-m1)^T * Cov1_inv * (x-m1)
           const quad1 = cov1Inv.a * dx1 * dx1 + 2 * cov1Inv.b * dx1 * dy1 + cov1Inv.c * dy1 * dy1;

           const dx2 = point.x - m2.x;
           const dy2 = point.y - m2.y;
            // Mahalanobis distance squared for class 2: (x-m2)^T * Cov2_inv * (x-m2)
           const quad2 = cov2Inv.a * dx2 * dx2 + 2 * cov2Inv.b * dx2 * dy2 + cov2Inv.c * dy2 * dy2;

           // Full discriminant function (proportional to log posterior ratio assuming equal priors):
           // g(x) = log(p(x|C1)) - log(p(x|C2))
           // g(x) = -0.5 * [(x-m1)^T * Cov1_inv * (x-m1) + log|Cov1|] + 0.5 * [(x-m2)^T * Cov2_inv * (x-m2) + log|Cov2|]
           // g(x) = -0.5 * (quad1 + logDet1) + 0.5 * (quad2 + logDet2)

           const discriminant = -0.5 * (quad1 + logDet1) + 0.5 * (quad2 + logDet2);

           // Classify based on the sign of the discriminant
           // If discriminant > 0, p(x|C1) > p(x|C2), so classify as C1
           // If discriminant < 0, p(x|C1) < p(x|C2), so classify as C2
           return discriminant >= 0 ? 1 : 2; // Use >= 0 for consistency if discriminant is exactly 0
      }

      // Default fallback (shouldn't be reached if mode is valid)
      console.warn("Unknown classification mode in calculatePerformanceMetrics:", mode);
      return 1;
  } // --- End of classify function ---


  // --- Count classifications ---
  let truePositives = 0;  // Class 1 correctly classified as 1
  let falseNegatives = 0; // Class 1 incorrectly classified as 2
  let falsePositives = 0; // Class 2 incorrectly classified as 1
  let trueNegatives = 0;  // Class 2 correctly classified as 2

  // Iterate through class 1 data
  classData.class1.forEach(point => {
      if (classify(point) === 1) {
          truePositives++;
      } else {
          falseNegatives++;
      }
  });

  // Iterate through class 2 data
  classData.class2.forEach(point => {
      if (classify(point) === 2) {
          trueNegatives++;
      } else {
          falsePositives++;
      }
  });

  // --- Calculate metrics ---
  const totalPoints = truePositives + falseNegatives + falsePositives + trueNegatives;
  let accuracy = 0, precision = 0, recall = 0, f1Score = 0;

  if (totalPoints > 0) {
      accuracy = ((truePositives + trueNegatives) / totalPoints);

      // Handle potential division by zero for precision, recall, f1
      if (truePositives + falsePositives > 0) {
          precision = (truePositives / (truePositives + falsePositives));
      } else {
           precision = (truePositives === 0) ? 1.0 : 0.0; // If TP=0 and FP=0, precision is arguably 1 or undefined. Set to 1 if TP=0, otherwise 0.
      }


      if (truePositives + falseNegatives > 0) {
          recall = (truePositives / (truePositives + falseNegatives));
      } else {
           recall = (truePositives === 0) ? 1.0 : 0.0; // Similar logic for recall
      }


      if (precision + recall > 0) {
          f1Score = (2 * precision * recall) / (precision + recall);
          // Alternative F1 calculation using counts directly to avoid intermediate NaNs
          // if (2 * truePositives + falsePositives + falseNegatives > 0) {
          //     f1Score = (2 * truePositives) / (2 * truePositives + falsePositives + falseNegatives);
          // }
      } else {
           f1Score = (truePositives === 0) ? 1.0 : 0.0; // If precision and recall are 0, F1 is 0, unless TP=0.
      }

  }

  // --- Update metrics display ---
  // Use utility function to safely update DOM elements
  const updateMetricValue = (id, value) => {
      const element = document.querySelector(`#${id} .metric-value`);
      if (element) {
          // Format as percentage, handle NaN
          element.textContent = isNaN(value) ? '-' : `${(value * 100).toFixed(1)}%`;
      } else {
          console.warn(`Metric element with id '${id}' not found.`);
      }
  };

  // Assuming your HTML structure has divs with IDs like 'accuracyMetric', 'precisionMetric', etc.
  // If not, adjust the querySelector below or the HTML structure.
  // Let's assume the structure is like the previous example:
  // <div id="performanceMetrics">
  //    <div class="metric-item"> <div class="metric-value">..</div> <div class="metric-label">Accuracy</div> </div> ...
  // </div>
  // We need a way to target specific metric values. Let's modify the HTML slightly or use nth-child.
  // Easiest: Give IDs to the metric-item divs or the metric-value divs themselves.

  // Example assuming IDs on metric-item divs:
  // <div id="accuracyMetric" class="metric-item">...</div>
  // updateMetricValue('accuracyMetric', accuracy); // Call like this

  // OR, assuming the order is fixed (Accuracy, Precision, Recall, F1):
  const metricValueElements = performanceMetrics.querySelectorAll('.metric-value');
  if (metricValueElements.length === 4) {
      metricValueElements[0].textContent = isNaN(accuracy) ? '-' : `${(accuracy * 100).toFixed(1)}%`;
      metricValueElements[1].textContent = isNaN(precision) ? '-' : `${(precision * 100).toFixed(1)}%`;
      metricValueElements[2].textContent = isNaN(recall) ? '-' : `${(recall * 100).toFixed(1)}%`;
      metricValueElements[3].textContent = isNaN(f1Score) ? '-' : `${(f1Score * 100).toFixed(1)}%`;
  } else {
      // Fallback if structure is different - update the whole block
      performanceMetrics.innerHTML = `
          <div class="metric-item">
            <div class="metric-value">${isNaN(accuracy) ? '-' : (accuracy * 100).toFixed(1)}%</div>
            <div class="metric-label">Accuracy</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">${isNaN(precision) ? '-' : (precision * 100).toFixed(1)}%</div>
            <div class="metric-label">Precision</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">${isNaN(recall) ? '-' : (recall * 100).toFixed(1)}%</div>
            <div class="metric-label">Recall</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">${isNaN(f1Score) ? '-' : (f1Score * 100).toFixed(1)}%</div>
            <div class="metric-label">F1 Score</div>
          </div>
      `;
  }
}

// Utility: Standard normal random variable using Box–Muller transform.
function randnBm() {
  let u = 0, v = 0;
  while(u === 0) u = Math.random();
  while(v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Poisson random generator using Knuth's algorithm.
function randPoisson(lambda) {
  let L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

// Generate 2D Gaussian sample.
// If covariance is a number, treat it as variance (same in both directions).
function generateGaussianSample(mean, covariance) {
  let sample = {};
  if (typeof covariance === 'number') {
    sample.x = mean.x + Math.sqrt(covariance) * randnBm();
    sample.y = mean.y + Math.sqrt(covariance) * randnBm();
  } else {
    // covariance as an object: { a, b, c } for 2x2 matrix.
    const a = covariance.a;
    const b = covariance.b;
    const c = covariance.c;
    const L11 = Math.sqrt(a);
    const L21 = b / L11;
    const L22 = Math.sqrt(c - L21 * L21);
    const z1 = randnBm();
    const z2 = randnBm();
    sample.x = mean.x + L11 * z1;
    sample.y = mean.y + L21 * z1 + L22 * z2;
  }
  return sample;
}

// Generate datasets based on the selected distribution mode.
function generateData() {
  const mode = distributionSelect.value;
  classData.class1 = [];
  classData.class2 = [];
  
  if (mode === "gaussian_equal") {
    // 2D Gaussian with equal covariance.
    const params = {
      class1: { mean: { x: 150, y: 150 }, variance: 400 },
      class2: { mean: { x: 450, y: 250 }, variance: 400 }
    };
    for (let i = 0; i < sampleSize; i++) {
      classData.class1.push(generateGaussianSample(params.class1.mean, params.class1.variance));
      classData.class2.push(generateGaussianSample(params.class2.mean, params.class2.variance));
    }
    resultsDiv.innerHTML = `<p>Data generated for <strong>Gaussian (2D) – Equal Covariance</strong> with ${sampleSize} points per class.</p>`;
  }
  else if (mode === "gaussian_diff") {
    // 2D Gaussian with different covariances.
    const params = {
      class1: { 
        mean: { x: 180, y: 180 },
        covariance: { a: 500, b: 120, c: 300 }
      },
      class2: { 
        mean: { x: 400, y: 280 },
        covariance: { a: 300, b: -80, c: 500 }
      }
    };
    for (let i = 0; i < sampleSize; i++) {
      classData.class1.push(generateGaussianSample(params.class1.mean, params.class1.covariance));
      classData.class2.push(generateGaussianSample(params.class2.mean, params.class2.covariance));
    }
    resultsDiv.innerHTML = `<p>Data generated for <strong>Gaussian (2D) – Different Covariance</strong> with ${sampleSize} points per class.</p>`;
  }
  else if (mode === "normal") {
    // 1D Normal Distribution.
    // Use normal distributions along the x-axis; add vertical jitter.
    const params = {
      class1: { mean: 150, variance: 400 },
      class2: { mean: 450, variance: 400 }
    };
    for (let i = 0; i < sampleSize; i++) {
      let x1 = params.class1.mean + Math.sqrt(params.class1.variance) * randnBm();
      let x2 = params.class2.mean + Math.sqrt(params.class2.variance) * randnBm();
      classData.class1.push({ x: x1, y: canvas.height/2 + (Math.random()-0.5)*10 });
      classData.class2.push({ x: x2, y: canvas.height/2 + (Math.random()-0.5)*10 });
    }
    resultsDiv.innerHTML = `<p>Data generated for <strong>Normal Distribution (1D)</strong> with ${sampleSize} points per class.</p>`;
  }
  else if (mode === "bernoulli") {
    // Bernoulli Distribution (1D): outcomes are 0 or 1.
    // For visualization, map 0 to x = 150 and 1 to x = 450.
    const params = {
      class1: { p: 0.3 },
      class2: { p: 0.7 }
    };
    for (let i = 0; i < sampleSize; i++) {
      let outcome1 = (Math.random() < params.class1.p) ? 1 : 0;
      let outcome2 = (Math.random() < params.class2.p) ? 1 : 0;
      let x1 = outcome1 === 1 ? 450 : 150;
      let x2 = outcome2 === 1 ? 450 : 150;
      classData.class1.push({ x: x1, y: canvas.height/2 + (Math.random()-0.5)*10 });
      classData.class2.push({ x: x2, y: canvas.height/2 + (Math.random()-0.5)*10 });
    }
    resultsDiv.innerHTML = `<p>Data generated for <strong>Bernoulli Distribution (1D)</strong> with ${sampleSize} points per class.</p>`;
  }
  else if (mode === "poisson") {
    // Poisson Distribution (1D): outcomes are nonnegative integers.
    // For visualization, map outcome to x: x = margin + outcome * scale.
    const margin = 100;
    const scale = 50;
    const params = {
      class1: { lambda: 2 },
      class2: { lambda: 5 }
    };
    for (let i = 0; i < sampleSize; i++) {
      let outcome1 = randPoisson(params.class1.lambda);
      let outcome2 = randPoisson(params.class2.lambda);
      let x1 = margin + outcome1 * scale;
      let x2 = margin + outcome2 * scale;
      classData.class1.push({ x: x1, y: canvas.height/2 + (Math.random()-0.5)*10 });
      classData.class2.push({ x: x2, y: canvas.height/2 + (Math.random()-0.5)*10 });
    }
    resultsDiv.innerHTML = `<p>Data generated for <strong>Poisson Distribution (1D)</strong> with ${sampleSize} points per class.</p>`;
  }
  
  drawData();
  updateExplanationPanel();
  // Clear previous MLE estimates.
  mleEstimates = { class1: {}, class2: {} };
  
  // Reset performance metrics
  performanceMetrics.innerHTML = "Generate data and classify to see metrics";
}

// Draw the generated data on the canvas according to the mode.
function drawData() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const mode = distributionSelect.value;
  const isDarkMode = document.body.classList.contains('dark-mode');
  
  // Set point styles according to mode.
  let pointRadius = 4;
  
  // Class colors from CSS variables
  const class1Color = getComputedStyle(document.documentElement).getPropertyValue('--class1-color').trim();
  const class2Color = getComputedStyle(document.documentElement).getPropertyValue('--class2-color').trim();
  
  if (mode === "gaussian_equal" || mode === "gaussian_diff") {
    // 2D points.
    ctx.fillStyle = class1Color;
    classData.class1.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, pointRadius, 0, 2 * Math.PI);
      ctx.fill();
    });
    ctx.fillStyle = class2Color;
    classData.class2.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, pointRadius, 0, 2 * Math.PI);
      ctx.fill();
    });
  } else {
    // 1D distributions: points along horizontal line.
    ctx.fillStyle = class1Color;
    classData.class1.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, pointRadius, 0, 2 * Math.PI);
      ctx.fill();
    });
    ctx.fillStyle = class2Color;
    classData.class2.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, pointRadius, 0, 2 * Math.PI);
      ctx.fill();
    });
  }
}

// For 2D modes: compute sample mean from x and y coordinates.
// For 1D modes: compute only the x-axis sample mean.
function computeMLEMean(data, is1D = false) {
  let sum = 0, sumY = 0;
  data.forEach(p => {
    sum += p.x;
    if (!is1D) sumY += p.y;
  });
  let mean = { meanX: sum / data.length };
  if (!is1D) {
    mean.meanY = sumY / data.length;
  }
  return mean;
}

// Compute sample covariance (only used in 2D different covariance mode).
function computeMLECovariance(data, mean) {
  let sumXX = 0, sumXY = 0, sumYY = 0;
  data.forEach(p => {
    let dx = p.x - mean.meanX;
    let dy = p.y - mean.meanY;
    sumXX += dx * dx;
    sumXY += dx * dy;
    sumYY += dy * dy;
  });
  return { 
    a: sumXX / data.length, 
    b: sumXY / data.length, 
    c: sumYY / data.length 
  };
}

// Estimate parameters (MLEs) and display them.
function estimateMLE() {
  const mode = distributionSelect.value;
  let is1D = (mode === "normal" || mode === "bernoulli" || mode === "poisson");
  
  mleEstimates.class1.mean = computeMLEMean(classData.class1, is1D);
  mleEstimates.class2.mean = computeMLEMean(classData.class2, is1D);
  
  let htmlStr = `<p>MLE Estimates:</p><ul>`;
  if (is1D) {
    htmlStr += `<li>Class 1 Mean (x): ${mleEstimates.class1.mean.meanX.toFixed(2)}</li>
      <li>Class 2 Mean (x): ${mleEstimates.class2.mean.meanX.toFixed(2)}</li>`;
    
    if (mode === "bernoulli") {
      // Calculate p from data (proportion of 1s)
      const class1Count1 = classData.class1.filter(p => p.x === 450).length;
      const class2Count1 = classData.class2.filter(p => p.x === 450).length;
      
      const p1 = class1Count1 / classData.class1.length;
      const p2 = class2Count1 / classData.class2.length;
      
      htmlStr += `<li>Class 1 p: ${p1.toFixed(3)}</li>
                  <li>Class 2 p: ${p2.toFixed(3)}</li>`;
    }
    else if (mode === "poisson") {
      // Lambda is the mean
      const margin = 100, scale = 50;
      let sum1 = 0, sum2 = 0;
      
      classData.class1.forEach(p => {
        sum1 += (p.x - margin) / scale;
      });
      
      classData.class2.forEach(p => {
        sum2 += (p.x - margin) / scale;
      });
      
      const lambda1 = sum1 / classData.class1.length;
      const lambda2 = sum2 / classData.class2.length;
      
      htmlStr += `<li>Class 1 λ: ${lambda1.toFixed(3)}</li>
                  <li>Class 2 λ: ${lambda2.toFixed(3)}</li>`;
    }
  } else {
    htmlStr += `<li>Class 1 Mean: (${mleEstimates.class1.mean.meanX.toFixed(2)}, ${mleEstimates.class1.mean.meanY.toFixed(2)})</li>
      <li>Class 2 Mean: (${mleEstimates.class2.mean.meanX.toFixed(2)}, ${mleEstimates.class2.mean.meanY.toFixed(2)})</li>`;
    if (mode === "gaussian_diff") {
      mleEstimates.class1.covariance = computeMLECovariance(classData.class1, mleEstimates.class1.mean);
      mleEstimates.class2.covariance = computeMLECovariance(classData.class2, mleEstimates.class2.mean);
      htmlStr += `<li>Class 1 Covariance: [${mleEstimates.class1.covariance.a.toFixed(1)}, ${mleEstimates.class1.covariance.b.toFixed(1)}; ...]</li>
                  <li>Class 2 Covariance: [${mleEstimates.class2.covariance.a.toFixed(1)}, ${mleEstimates.class2.covariance.b.toFixed(1)}; ...]</li>`;
    }
  }
  htmlStr += `</ul>`;
  resultsDiv.innerHTML = htmlStr;
}

function markAll() {
  const mode = distributionSelect.value;
  let is1D = (mode === "normal" || mode === "bernoulli" || mode === "poisson");

  // Ensure that the MLE has been computed.
  if (!mleEstimates.class1.mean) {
      resultsDiv.innerHTML = "<p>Please estimate MLE parameters first.</p>";
      // Optionally call estimateMLE() here if you want it to happen automatically
      // estimateMLE();
      // if (!mleEstimates.class1.mean) return; // Exit if still no estimates
      return;
  }

  // --- Step 1: Clear Canvas ---
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas *once* at the beginning

  const decisionColor = getComputedStyle(document.documentElement).getPropertyValue('--decision-color').trim();
  const class1ColorData = getComputedStyle(document.documentElement).getPropertyValue('--class1-color').trim();
  const class2ColorData = getComputedStyle(document.documentElement).getPropertyValue('--class2-color').trim();

  // --- Step 2: Draw Decision Boundary / Background Shading ---
  if (!is1D) {
      // For 2D distributions.
      if (mode === "gaussian_equal") {
          // Linear decision boundary: perpendicular bisector of the two means.
          const m1 = { x: mleEstimates.class1.mean.meanX, y: mleEstimates.class1.mean.meanY };
          const m2 = { x: mleEstimates.class2.mean.meanX, y: mleEstimates.class2.mean.meanY };
          const mid = { x: (m1.x + m2.x) / 2, y: (m1.y + m2.y) / 2 };
          const dx = m2.x - m1.x, dy = m2.y - m1.y;

          // Handle vertical/horizontal lines explicitly
          ctx.strokeStyle = decisionColor;
          ctx.lineWidth = 2; // Use a slightly thinner line for boundary
          ctx.beginPath();

          if (Math.abs(dy) < 1e-6) { // Essentially horizontal line connecting means -> vertical boundary
              ctx.moveTo(mid.x, 0);
              ctx.lineTo(mid.x, canvas.height);
          } else if (Math.abs(dx) < 1e-6) { // Essentially vertical line connecting means -> horizontal boundary
               ctx.moveTo(0, mid.y);
               ctx.lineTo(canvas.width, mid.y);
          } else { // General case
               const slope = -dx / dy;
               const yIntercept = mid.y - slope * mid.x;
               const y1 = yIntercept; // y at x=0
               const y2 = slope * canvas.width + yIntercept; // y at x=width
               ctx.moveTo(0, y1);
               ctx.lineTo(canvas.width, y2);
          }
           ctx.stroke();

      } else if (mode === "gaussian_diff") {
          // Quadratic decision boundary via background grid classification.
           const m1 = { x: mleEstimates.class1.mean.meanX, y: mleEstimates.class1.mean.meanY };
           const m2 = { x: mleEstimates.class2.mean.meanX, y: mleEstimates.class2.mean.meanY };

           // Define semi-transparent colors for background shading
           const class1BGColor = "rgba(255, 111, 97, 0.15)"; // More visible alpha
           const class2BGColor = "rgba(76, 201, 240, 0.15)"; // More visible alpha

           // Helper: Calculate covariance determinant
           function covDet(cov) {
               const det = cov.a * cov.c - cov.b * cov.b;
               // Handle potential numerical issues leading to non-positive determinant
               return Math.max(det, 1e-6); // Return small positive if determinant is <= 0
           }

           // Helper: Calculate covariance inverse
           function covInverse(cov) {
               const det = covDet(cov);
               return {
                   a: cov.c / det,
                   b: -cov.b / det,
                   c: cov.a / det
                   // No need to return det here
               };
           }

           // Check if covariance matrices are valid before proceeding
           if (!mleEstimates.class1.covariance || !mleEstimates.class2.covariance) {
               console.error("Covariance matrices not estimated.");
               resultsDiv.innerHTML += "<p style='color:red;'>Error: Covariance not estimated.</p>";
               // Draw data points anyway before returning
               drawDataPointsOnly(); // Draw points so canvas isn't blank
               return;
           }

           const cov1Inv = covInverse(mleEstimates.class1.covariance);
           const cov2Inv = covInverse(mleEstimates.class2.covariance);

           const logDet1 = Math.log(covDet(mleEstimates.class1.covariance));
           const logDet2 = Math.log(covDet(mleEstimates.class2.covariance));

           const gridSize = 5; // Adjust for performance vs detail

           for (let x = 0; x < canvas.width; x += gridSize) {
               for (let y = 0; y < canvas.height; y += gridSize) {
                   // Use center of grid cell for calculation
                   const gridX = x + gridSize / 2;
                   const gridY = y + gridSize / 2;

                   const dx1 = gridX - m1.x;
                   const dy1 = gridY - m1.y;
                   const quad1 = cov1Inv.a * dx1 * dx1 + 2 * cov1Inv.b * dx1 * dy1 + cov1Inv.c * dy1 * dy1;

                   const dx2 = gridX - m2.x;
                   const dy2 = gridY - m2.y;
                   const quad2 = cov2Inv.a * dx2 * dx2 + 2 * cov2Inv.b * dx2 * dy2 + cov2Inv.c * dy2 * dy2;

                   // Discriminant: log likelihood ratio (simplified assuming equal priors)
                   // log(p(x|C1)) - log(p(x|C2))
                   // If > 0, classify as C1. If < 0, classify as C2.
                   // Note the sign change compared to the original code's formula
                   const discriminant = -0.5 * (quad1 + logDet1) + 0.5 * (quad2 + logDet2);

                   // Fill the grid cell based on classification
                   ctx.fillStyle = (discriminant > 0) ? class1BGColor : class2BGColor;
                   ctx.fillRect(x, y, gridSize, gridSize);
               }
           }
           // NO explicit boundary points needed - the edge between colors IS the boundary.
      }
  } else {
      // For 1D distributions.
      // Compute decision boundary as vertical line at midpoint of the x-values.
      const m1x = mleEstimates.class1.mean.meanX;
      const m2x = mleEstimates.class2.mean.meanX;
      const boundaryX = (m1x + m2x) / 2;

      ctx.strokeStyle = decisionColor;
      ctx.lineWidth = 2; // Thinner line
      ctx.beginPath();
      ctx.moveTo(boundaryX, 0);
      ctx.lineTo(boundaryX, canvas.height);
      ctx.stroke();
  }

  // --- Step 3: Draw Data Points ON TOP of background/boundary ---
  // Re-implement drawing points logic here instead of calling drawData()
  function drawDataPointsOnly() {
      const pointRadius = 4;
      ctx.fillStyle = class1ColorData; // Use the actual data point colors
      classData.class1.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, pointRadius, 0, 2 * Math.PI);
          ctx.fill();
      });
      ctx.fillStyle = class2ColorData; // Use the actual data point colors
      classData.class2.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, pointRadius, 0, 2 * Math.PI);
          ctx.fill();
      });
  }
  drawDataPointsOnly(); // Call the local function to draw points


  // --- Step 4: Draw Mean Highlights ON TOP of data points ---
  const highlightFillColor = "#F4D06F"; // Gold
  const highlightRadius = 8;
  const highlightLineWidth = 2; // Thinner outline

  if (mleEstimates.class1.mean && mleEstimates.class2.mean) {
       if (!is1D) {
           // Highlight the estimated means for 2D.
           const m1 = { x: mleEstimates.class1.mean.meanX, y: mleEstimates.class1.mean.meanY };
           const m2 = { x: mleEstimates.class2.mean.meanX, y: mleEstimates.class2.mean.meanY };

           // Draw highlight for class 1 mean
           ctx.beginPath();
           ctx.arc(m1.x, m1.y, highlightRadius, 0, 2 * Math.PI);
           ctx.fillStyle = highlightFillColor;
           ctx.fill();
           ctx.strokeStyle = class1ColorData; // Outline with data color
           ctx.lineWidth = highlightLineWidth;
           ctx.stroke();

           // Draw highlight for class 2 mean
           ctx.beginPath();
           ctx.arc(m2.x, m2.y, highlightRadius, 0, 2 * Math.PI);
           ctx.fillStyle = highlightFillColor;
           ctx.fill();
           ctx.strokeStyle = class2ColorData; // Outline with data color
           ctx.lineWidth = highlightLineWidth;
           ctx.stroke();
       } else {
           // Highlight estimated means for 1D (along center line).
           const m1x = mleEstimates.class1.mean.meanX;
           const m2x = mleEstimates.class2.mean.meanX;
           const midY = canvas.height / 2;

           // Draw highlight for class 1 mean
           ctx.beginPath();
           ctx.arc(m1x, midY, highlightRadius, 0, 2 * Math.PI);
           ctx.fillStyle = highlightFillColor;
           ctx.fill();
           ctx.strokeStyle = class1ColorData;
           ctx.lineWidth = highlightLineWidth;
           ctx.stroke();

           // Draw highlight for class 2 mean
           ctx.beginPath();
           ctx.arc(m2x, midY, highlightRadius, 0, 2 * Math.PI);
           ctx.fillStyle = highlightFillColor;
           ctx.fill();
           ctx.strokeStyle = class2ColorData;
           ctx.lineWidth = highlightLineWidth;
           ctx.stroke();
       }
  }


  // --- Step 5: Calculate and display performance metrics ---
  calculatePerformanceMetrics();
}

// Initialize the application when window loads
window.onload = init;
