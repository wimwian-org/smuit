/*
 * @smuit/ripple
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */

/**
 * Material UI–style touch ripple, as a Svelte action.
 *
 * Attaches to any element and, on pointer-down (and keyboard activation), spawns
 * a circle that expands from the contact point to cover the element, fading out
 * as it grows — the classic MD "touch ripple". Implemented with the Web
 * Animations API and inline styles: no stylesheet, no dependencies.
 *
 *   <button use:ripple={{ variant: 'md' }}>Click</button>
 *
 * The host is made `position: relative; overflow: hidden` automatically if it
 * isn't already, so ripples are clipped to its box.
 */

/** Size/speed variant. Controls the ripple's expansion duration (xs snappy → xl languid). */
export type RippleVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface RippleOptions {
    /** Expansion-duration variant. Default `'md'`. */
    variant?: RippleVariant;
    /** Ripple colour (any CSS colour). Default `'currentColor'`. */
    color?: string;
    /** Peak opacity at the start of the animation. Default `0.3`. */
    opacity?: number;
    /** Emit every ripple from the host's centre instead of the contact point. */
    center?: boolean;
    /** Suppress ripples entirely. */
    disabled?: boolean;
}

export const rippleVariants = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

/**
 * Expansion duration (ms) per variant — geometric around `md` (600 ms, ratio ≈ 1.4),
 * so the set fans out symmetrically the same way the theme's size ramps do.
 */
const DURATION: Record<RippleVariant, number> = {
    xs: 300,
    sm: 430,
    md: 600,
    lg: 840,
    xl: 1180,
};

const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

const prefersReducedMotion = (): boolean =>
    typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function ripple(node: HTMLElement, options: RippleOptions = {}) {
    let opts: RippleOptions = { ...options };

    function spawn(clientX: number, clientY: number): void {
        if (opts.disabled) return;

        const rect = node.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        // Ensure ripples are contained within the host.
        const cs = getComputedStyle(node);
        if (cs.position === 'static') node.style.position = 'relative';
        if (cs.overflow === 'visible') node.style.overflow = 'hidden';

        const x = opts.center ? rect.width / 2 : clientX - rect.left;
        const y = opts.center ? rect.height / 2 : clientY - rect.top;

        // Radius = distance from the contact point to the farthest corner, so the
        // ripple always grows to cover the whole element.
        const radius = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y));
        const diameter = radius * 2;
        const peak = opts.opacity ?? 0.3;

        const span = document.createElement('span');
        span.setAttribute('aria-hidden', 'true');
        span.style.cssText =
            `position:absolute;left:${x - radius}px;top:${y - radius}px;` +
            `width:${diameter}px;height:${diameter}px;border-radius:50%;` +
            `background:${opts.color ?? 'currentColor'};pointer-events:none;` +
            `transform:scale(0);opacity:${peak};will-change:transform,opacity`;
        node.appendChild(span);

        // Reduced motion: a brief, motionless fade instead of an expansion.
        const reduce = prefersReducedMotion();
        const duration = reduce ? 200 : DURATION[opts.variant ?? 'md'];
        const keyframes: Keyframe[] = reduce
            ? [
                  { transform: 'scale(1)', opacity: peak },
                  { transform: 'scale(1)', opacity: 0 },
              ]
            : [
                  { transform: 'scale(0)', opacity: peak },
                  { transform: 'scale(1)', opacity: 0 },
              ];

        const anim = span.animate(keyframes, { duration, easing: EASING, fill: 'forwards' });
        const cleanup = () => span.remove();
        anim.onfinish = cleanup;
        anim.oncancel = cleanup;
    }

    function onPointerDown(e: PointerEvent): void {
        // Primary pointer only (left mouse button / touch / pen).
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        spawn(e.clientX, e.clientY);
    }

    function onKeyDown(e: KeyboardEvent): void {
        if (e.repeat) return;
        if (e.key === ' ' || e.key === 'Enter') {
            const rect = node.getBoundingClientRect();
            spawn(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
    }

    node.addEventListener('pointerdown', onPointerDown);
    node.addEventListener('keydown', onKeyDown);

    return {
        update(next: RippleOptions = {}) {
            opts = { ...next };
        },
        destroy() {
            node.removeEventListener('pointerdown', onPointerDown);
            node.removeEventListener('keydown', onKeyDown);
        },
    };
}
