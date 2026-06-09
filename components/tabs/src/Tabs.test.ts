/*
 * @smuit/tabs
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import { afterEach, expect, test } from 'vitest';
import { page, userEvent } from '@vitest/browser/context';
import { render } from 'vitest-browser-svelte';
import Harness from './tabs-harness.test.svelte';
import RefHarness from './tabs-ref.test.svelte';

afterEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-theme');
});

const root = () => document.querySelector('.tabs') as HTMLElement;
const tabByName = (name: string) =>
    Array.from(document.querySelectorAll<HTMLElement>('[role="tab"]')).find((t) => t.textContent?.includes(name)) as
        | HTMLElement
        | undefined;

// ── render contract ───────────────────────────────────────────────────────────
test('renders the tablist / tab / tabpanel roles with the bold defaults', async () => {
    render(Harness, {});
    await expect.element(page.getByRole('tablist')).toBeInTheDocument();
    expect(document.querySelectorAll('[role="tab"]').length).toBe(3);
    await expect.element(page.getByRole('tabpanel')).toHaveTextContent('Panel one');

    const el = root();
    expect(el.dataset.variant).toBe('bold');
    expect(el.dataset.size).toBe('md');
    expect(el.dataset.tint).toBe('neutral');
    expect(el.className).toContain('tabs');
});

test('the initial active tab is marked and its panel is shown', () => {
    render(Harness, {});
    expect(tabByName('One')?.dataset.state).toBe('active');
    expect(tabByName('Two')?.dataset.state).toBe('inactive');
});

// ── selection ───────────────────────────────────────────────────────────────
test('clicking a tab activates it and swaps the panel (automatic)', async () => {
    render(Harness, {});
    await page.getByRole('tab', { name: 'Two' }).click();
    expect(tabByName('Two')?.dataset.state).toBe('active');
    expect(tabByName('One')?.dataset.state).toBe('inactive');
    await expect.element(page.getByRole('tabpanel')).toHaveTextContent('Panel two');
});

// ── activation mode (our prop forwarding to bits-ui) ──────────────────────────
test('automatic: arrowing to a tab activates it and swaps the panel', async () => {
    render(Harness, {});
    tabByName('One')?.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(tabByName('Two'));
    expect(tabByName('Two')?.dataset.state).toBe('active');
    await expect.element(page.getByRole('tabpanel')).toHaveTextContent('Panel two');
});

test('manual: arrowing moves focus only; Enter activates', async () => {
    render(Harness, { activationMode: 'manual' });
    tabByName('One')?.focus();
    await userEvent.keyboard('{ArrowRight}');
    // Focus moved, but the selection (and panel) has not changed yet.
    expect(document.activeElement).toBe(tabByName('Two'));
    expect(tabByName('One')?.dataset.state).toBe('active');
    await userEvent.keyboard('{Enter}');
    expect(tabByName('Two')?.dataset.state).toBe('active');
});

// ── variant axis ──────────────────────────────────────────────────────────────
test('subtle variant sets the data hook on the container', () => {
    render(Harness, { variant: 'subtle' });
    expect(root().dataset.variant).toBe('subtle');
});

// ── size axis ─────────────────────────────────────────────────────────────────
test('sm size sets the data hook and the trigger height utility', () => {
    render(Harness, { size: 'sm' });
    expect(root().dataset.size).toBe('sm');
    expect(tabByName('One')?.className).toContain('h-10');
});

test('md size applies the taller trigger height utility', () => {
    render(Harness, {});
    expect(tabByName('One')?.className).toContain('h-12');
});

// ── tint axis ─────────────────────────────────────────────────────────────────
test('tint sets the data-tint hook on the container', () => {
    render(Harness, { tint: 'primary' });
    expect(root().dataset.tint).toBe('primary');
});

// ── leading icon slot ───────────────────────────────────────────────────────
test('renders the optional inline leading icon', () => {
    render(Harness, {});
    const three = tabByName('Three');
    expect(three?.querySelector('[data-slot="icon"]')).not.toBeNull();
    expect(three?.querySelector('[data-testid="tab-icon"]')).not.toBeNull();
});

// ── sliding indicator ─────────────────────────────────────────────────────────
test('renders a single decorative active indicator inside the tablist', () => {
    render(Harness, {});
    const indicators = root().querySelectorAll('[data-slot="indicator"]');
    expect(indicators.length).toBe(1);
    expect(indicators[0].getAttribute('aria-hidden')).toBe('true');
});

// ── states ──────────────────────────────────────────────────────────────────
test('a disabled trigger sets data-disabled and cannot be activated', async () => {
    render(Harness, { disabledTwo: true });
    const two = tabByName('Two');
    expect(two?.hasAttribute('data-disabled')).toBe(true);
    // Clicking the disabled tab does not activate it; One stays active.
    await two?.click();
    expect(tabByName('One')?.dataset.state).toBe('active');
    expect(two?.dataset.state).toBe('inactive');
});

// ── ref + class ───────────────────────────────────────────────────────────────
test('binds ref to the underlying trigger button', () => {
    let ref: HTMLElement | null = null;
    render(RefHarness, { onRef: (el) => (ref = el) });
    expect(ref).toBeInstanceOf(HTMLButtonElement);
});

test('merges a consumer class onto a trigger', () => {
    render(Harness, { triggerClass: 'my-tab' });
    expect(tabByName('One')?.className).toContain('my-tab');
    // The base trigger class is preserved alongside the consumer class.
    expect(tabByName('One')?.className).toContain('tabs-trigger');
});
