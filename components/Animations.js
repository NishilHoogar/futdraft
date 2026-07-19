/**
 * Animations.js
 * Utility functions for smooth animations throughout the game.
 */

/**
 * Animate an element flying from one position to another.
 * @param {HTMLElement} element - The element to animate (will be cloned)
 * @param {HTMLElement} target - The target element to fly to
 * @param {Function} onComplete - Callback when animation finishes
 */
export function flyPlayer(element, target, onComplete) {
  const rect = element.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  // Create a flying clone
  const clone = element.cloneNode(true);
  clone.style.position = 'fixed';
  clone.style.left = rect.left + 'px';
  clone.style.top = rect.top + 'px';
  clone.style.width = rect.width + 'px';
  clone.style.height = rect.height + 'px';
  clone.style.zIndex = '9999';
  clone.style.transition = 'none';
  clone.style.pointerEvents = 'none';
  clone.classList.add('flying-player');

  document.body.appendChild(clone);

  // Force reflow
  clone.offsetHeight;

  // Animate to target
  clone.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  clone.style.left = targetRect.left + 'px';
  clone.style.top = targetRect.top + 'px';
  clone.style.width = targetRect.width + 'px';
  clone.style.height = targetRect.height + 'px';
  clone.style.transform = 'scale(1)';

  setTimeout(() => {
    clone.remove();
    if (onComplete) onComplete();
  }, 600);
}

/**
 * Fade in an element.
 * @param {HTMLElement} element
 * @param {number} duration - Duration in ms
 */
export function fadeIn(element, duration = 400) {
  element.style.opacity = '0';
  element.style.display = '';
  element.offsetHeight; // reflow
  element.style.transition = `opacity ${duration}ms ease`;
  element.style.opacity = '1';
}

/**
 * Fade out an element.
 * @param {HTMLElement} element
 * @param {number} duration - Duration in ms
 * @param {Function} onComplete
 */
export function fadeOut(element, duration = 300, onComplete) {
  element.style.transition = `opacity ${duration}ms ease`;
  element.style.opacity = '0';
  setTimeout(() => {
    element.style.display = 'none';
    if (onComplete) onComplete();
  }, duration);
}

/**
 * Animate a progress bar to a target value.
 * @param {HTMLElement} bar - The progress bar fill element
 * @param {number} targetValue - Target percentage (0-100)
 * @param {number} duration - Duration in ms
 */
export function animateProgressBar(bar, targetValue, duration = 800) {
  const startValue = parseFloat(bar.style.width) || 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = startValue + (targetValue - startValue) * eased;
    bar.style.width = current + '%';

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/**
 * Slide in an element from a direction.
 * @param {HTMLElement} element
 * @param {string} direction - 'left', 'right', 'up', 'down'
 * @param {number} duration
 */
export function slideIn(element, direction = 'up', duration = 500) {
  const transforms = {
    left: 'translateX(-50px)',
    right: 'translateX(50px)',
    up: 'translateY(30px)',
    down: 'translateY(-30px)'
  };

  element.style.opacity = '0';
  element.style.transform = transforms[direction];
  element.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
  element.style.display = '';

  element.offsetHeight; // reflow

  element.style.opacity = '1';
  element.style.transform = 'translate(0, 0)';
}

/**
 * Staggered fade-in for a list of elements.
 * @param {HTMLElement[]} elements
 * @param {number} baseDelay
 * @param {number} staggerDelay
 */
export function staggerFadeIn(elements, baseDelay = 0, staggerDelay = 80) {
  elements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.4s ease';

    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, baseDelay + i * staggerDelay);
  });
}

/**
 * Create a ripple effect on a button click.
 * @param {MouseEvent} event
 * @param {HTMLElement} button
 */
export function createRipple(event, button) {
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');

  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';

  button.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

/**
 * Scale pulse animation for an element.
 * @param {HTMLElement} element
 */
export function pulse(element) {
  element.style.transition = 'transform 0.3s ease';
  element.style.transform = 'scale(1.05)';
  setTimeout(() => {
    element.style.transform = 'scale(1)';
  }, 300);
}
