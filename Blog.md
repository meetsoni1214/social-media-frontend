› Can you explain how setting state inside effect can cause problems?

• useEffect runs after render.
If you call setState inside it synchronously, you force an immediate second render cycle:

1. Render happens
2. Effect runs
3. setState(...) triggers another render
4. Effect may run again (if deps changed), possibly repeating

Why this is a problem:

- Extra renders: unnecessary work and slower UI.
- Cascade risk: effects that update state can chain into other effects.
- Loop risk: if state change affects effect deps, you can create render loops.
- Flicker/unstable UI: first render shows one state, effect immediately flips it.

In your cases:

- register/page.tsx: effect set redirect state, causing extra render just to hide content and redirect.
- PostImageDisplay.tsx: effect reset error state whenever imageSrc changed, adding render churn.

Better patterns:

- Derive state directly from props/data when possible.
- Initialize state up front (useState(() => ...)) instead of “fixing it” in effect.
- Keep effects for external sync (network, subscriptions, router navigation), not local state reshaping unless truly necessary.
