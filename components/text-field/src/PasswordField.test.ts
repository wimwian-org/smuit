/*
 * @wimwian-org/text-field
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import { afterEach, expect, test, vi } from 'vitest';
import { createRawSnippet } from 'svelte';
import { page } from '@vitest/browser/context';
import { render } from 'vitest-browser-svelte';
import PasswordField from './PasswordField.svelte';

afterEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-theme');
    vi.restoreAllMocks();
});

const input = () => document.querySelector('input') as HTMLInputElement;
const toggle = () => document.querySelector('[data-slot="reveal-toggle"]') as HTMLButtonElement;

// ── render contract ─────────────────────────────────────────────────────────
test('renders a masked password input', () => {
    render(PasswordField, { label: 'Password' });
    expect(input().getAttribute('type')).toBe('password');
});

test('defaults autocomplete to current-password', () => {
    render(PasswordField, { label: 'Password' });
    expect(input().getAttribute('autocomplete')).toBe('current-password');
});

test('autocomplete is overridable', () => {
    render(PasswordField, { label: 'New password', autocomplete: 'new-password' });
    expect(input().getAttribute('autocomplete')).toBe('new-password');
});

// ── reveal toggle ─────────────────────────────────────────────────────────────
test('shows a reveal toggle labelled "Show password" by default', async () => {
    render(PasswordField, { label: 'Password' });
    const btn = toggle();
    expect(btn).toBeTruthy();
    expect(btn.getAttribute('aria-label')).toBe('Show password');
    expect(btn.getAttribute('aria-pressed')).toBe('false');
    expect(input().getAttribute('type')).toBe('password');
});

test('clicking the toggle reveals the value and flips the label', async () => {
    render(PasswordField, { label: 'Password' });
    await page.getByRole('button', { name: 'Show password' }).click();
    await vi.waitFor(() => {
        expect(input().getAttribute('type')).toBe('text');
        expect(toggle().getAttribute('aria-label')).toBe('Hide password');
        expect(toggle().getAttribute('aria-pressed')).toBe('true');
    });
    await page.getByRole('button', { name: 'Hide password' }).click();
    await vi.waitFor(() => expect(input().getAttribute('type')).toBe('password'));
});

test('revealable={false} drops the toggle', () => {
    render(PasswordField, { label: 'PIN', revealable: false });
    expect(toggle()).toBeNull();
    expect(input().getAttribute('type')).toBe('password');
});

test('the toggle is a non-submitting button, disabled with the field', () => {
    render(PasswordField, { label: 'Password', disabled: true });
    const btn = toggle();
    expect(btn.getAttribute('type')).toBe('button');
    expect(btn.disabled).toBe(true);
});

// ── value binding ─────────────────────────────────────────────────────────────
test('two-way binds the value', async () => {
    render(PasswordField, { label: 'Password' });
    await page.getByLabelText('Password', { exact: true }).fill('hunter2');
    await vi.waitFor(() => expect(input().value).toBe('hunter2'));
});

// ── leading adornment + caption ───────────────────────────────────────────────
test('renders a leading adornment when a leadingIcon snippet is supplied', () => {
    const leadingIcon = createRawSnippet(() => ({
        render: () => `<svg data-testid="lead" aria-hidden="true"></svg>`,
    }));
    render(PasswordField, { label: 'Password', leadingIcon });
    expect(document.querySelector('[data-slot="leading"]')).toBeTruthy();
    expect(document.querySelector('[data-testid="lead"]')).toBeTruthy();
});

test('renders a caption (supporting text + counter) when supportingText / maxlength are set', () => {
    render(PasswordField, { label: 'Password', supportingText: 'Use 8+ characters', maxlength: 32 });
    expect(document.body.textContent).toContain('Use 8+ characters');
    expect(document.querySelector('.tf-counter')).toBeTruthy();
});

test('renders the caption for an error with errorText (no supportingText / maxlength)', () => {
    render(PasswordField, { label: 'Password', error: true, errorText: 'Too weak' });
    expect(document.querySelector('.tf-support-line')).toBeTruthy();
});
