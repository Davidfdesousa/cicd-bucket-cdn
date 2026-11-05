import { css } from 'lit';

export const buttonStyles = css`
  :host {
    display: inline-flex;
    vertical-align: middle;
  }

  :host([full-width]) {
    display: flex;
  }

  :host([disabled]),
  :host([loading]) {
    pointer-events: none;
  }

  button {
    --_bg: var(--color-bg-brand);
    --_bg-hover: var(--color-bg-brand-hover);
    --_bg-pressed: var(--color-bg-brand-pressed);
    --_content: var(--color-content-on-brand);
    --_border: transparent;

    all: unset;
    box-sizing: border-box;
    display: inline-flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-inline-xs);
    min-block-size: 2.5rem;
    padding-block: var(--spacing-inset-sm);
    padding-inline: var(--spacing-inset-md);
    border: 1px solid var(--_border);
    border-radius: var(--radius-control);
    background: var(--_bg);
    color: var(--_content);
    font-family: inherit;
    font-size: var(--typography-label-size);
    font-weight: var(--typography-label-weight);
    line-height: var(--line-height-tight);
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    transition:
      background-color var(--motion-duration-fast) var(--motion-easing-standard),
      border-color var(--motion-duration-fast) var(--motion-easing-standard);
  }

  button:hover {
    background: var(--_bg-hover);
  }

  button:active {
    background: var(--_bg-pressed);
  }

  button:focus-visible {
    outline: var(--focus-ring-width) solid var(--color-border-focus);
    outline-offset: var(--focus-ring-offset);
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  :host([variant='secondary']) button {
    --_bg: var(--color-bg-default);
    --_bg-hover: var(--color-bg-neutral-hover);
    --_bg-pressed: var(--color-bg-neutral-pressed);
    --_content: var(--color-content-default);
    --_border: var(--color-border-strong);
  }

  :host([variant='ghost']) button {
    --_bg: transparent;
    --_bg-hover: var(--color-bg-neutral-hover);
    --_bg-pressed: var(--color-bg-neutral-pressed);
    --_content: var(--color-content-default);
  }

  :host([size='sm']) button {
    min-block-size: 2rem;
    padding-block: var(--spacing-inset-xs);
    padding-inline: var(--spacing-inset-sm);
  }

  :host([icon-only]) button {
    aspect-ratio: 1;
    padding-inline: 0;
  }

  .spinner {
    inline-size: 1em;
    block-size: 1em;
    border: 2px solid currentColor;
    border-inline-end-color: transparent;
    border-radius: var(--radius-full);
    animation: spin 700ms linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation-duration: 2s;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(1turn);
    }
  }
`;
