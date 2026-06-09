/*
 * @wimwian-org/tabs
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

// ── orientation axis ──────────────────────────────────────────────────────────
test('vertical orientation sets the data-orientation hook and the row layout', () => {
    render(Harness, { orientation: 'vertical' });
    const el = root();
    expect(el.dataset.orientation).toBe('vertical');
    // Root flips to a row (list beside the panel); the list stacks its triggers.
    expect(el.className).toContain('flex-row');
    expect(document.querySelector('[role="tablist"]')?.className).toContain('flex-col');
});

test('horizontal (default) keeps the column root + data-orientation hook', () => {
    render(Harness, {});
    expect(root().dataset.orientation).toBe('horizontal');
    expect(root().className).toContain('flex-col');
});

test('vertical: ArrowDown moves + activates the next tab (automatic)', async () => {
    render(Harness, { orientation: 'vertical' });
    tabByName('One')?.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(tabByName('Two'));
    expect(tabByName('Two')?.dataset.state).toBe('active');
});

// ── stacked icon layout ───────────────────────────────────────────────────────
test('stacked iconLayout makes triggers column-stacked and taller', () => {
    render(Harness, { iconLayout: 'stacked' });
    const three = tabByName('Three');
    expect(three?.className).toContain('flex-col');
    expect(three?.className).toContain('h-16'); // md stacked
    // The leading icon still renders, now above the label.
    expect(three?.querySelector('[data-slot="icon"]')).not.toBeNull();
});

// ── badge slot ────────────────────────────────────────────────────────────────
test('renders the optional trailing badge after the label', () => {
    render(Harness, { badgeTwo: true });
    const two = tabByName('Two');
    expect(two?.querySelector('[data-slot="badge"]')).not.toBeNull();
    expect(two?.querySelector('[data-testid="tab-badge"]')?.textContent).toBe('3');
});

test('omits the badge when no badge snippet is supplied', () => {
    render(Harness, {});
    expect(tabByName('One')?.querySelector('[data-slot="badge"]')).toBeNull();
});

// ── overflow scrolling ────────────────────────────────────────────────────────
test('scrollable wraps the list with prev/next affordance buttons', () => {
    render(Harness, { scrollable: true });
    const wrap = document.querySelector('[data-slot="list-wrap"]');
    expect(wrap).not.toBeNull();
    // The tablist becomes a scroll viewport.
    expect(document.querySelector('[role="tablist"]')?.className).toContain('tabs-list-scroll');
    // Two affordance buttons, labelled, outside the roving tab order.
    const prev = document.querySelector('[data-slot="scroll-prev"]') as HTMLButtonElement;
    const next = document.querySelector('[data-slot="scroll-next"]') as HTMLButtonElement;
    expect(prev?.getAttribute('aria-label')).toBe('Scroll tabs backward');
    expect(next?.getAttribute('aria-label')).toBe('Scroll tabs forward');
    expect(prev?.tabIndex).toBe(-1);
    expect(next?.tabIndex).toBe(-1);
    // The affordance buttons are not tabs (they stay out of the tablist roving set).
    expect(prev?.getAttribute('role')).not.toBe('tab');
});

test('non-scrollable lists render no scroll wrapper or buttons', () => {
    render(Harness, {});
    expect(document.querySelector('[data-slot="list-wrap"]')).toBeNull();
    expect(document.querySelector('[data-slot="scroll-prev"]')).toBeNull();
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
