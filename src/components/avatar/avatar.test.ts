import { describe, expect, it } from 'vitest';

import { mount } from '../../test/render.ts';
import { getInitials, type AppAvatar } from './avatar.ts';

describe('getInitials', () => {
  it.each([
    ['Ada Lovelace', 'AL'],
    ['ada', 'A'],
    ['  Grace   Brewster Hopper ', 'GH'],
    ['', '?'],
  ])('%j → %s', (name, expected) => {
    expect(getInitials(name)).toBe(expected);
  });
});

describe('app-avatar', () => {
  it('falls back to initials without a photo', async () => {
    const element = await mount<AppAvatar>('<app-avatar name="Ada Lovelace"></app-avatar>');

    expect(element.shadowRoot?.textContent.trim()).toBe('AL');
    expect(element.shadowRoot?.querySelector('img')).toBeNull();
  });

  it('renders the photo when src is set', async () => {
    const element = await mount<AppAvatar>(
      '<app-avatar name="Ada" src="https://example.com/ada.png"></app-avatar>',
    );

    expect(element.shadowRoot?.querySelector('img')?.getAttribute('alt')).toBe('Ada');
  });
});
