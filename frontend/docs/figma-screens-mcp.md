# Go Around — Figma Screen Reference


@https://www.figma.com/design/MFniE15RZKwKCQGIa6Dv71/triasaldiprasetia-s-team-library?node-id=3354-691&m=dev
@https://www.figma.com/design/MFniE15RZKwKCQGIa6Dv71/triasaldiprasetia-s-team-library?node-id=3354-702&m=dev
@https://www.figma.com/design/MFniE15RZKwKCQGIa6Dv71/triasaldiprasetia-s-team-library?node-id=3354-248&m=dev
@https://www.figma.com/design/MFniE15RZKwKCQGIa6Dv71/triasaldiprasetia-s-team-library?node-id=3311-4459&m=dev
@https://www.figma.com/design/MFniE15RZKwKCQGIa6Dv71/triasaldiprasetia-s-team-library?node-id=3311-5133&m=dev
@https://www.figma.com/design/MFniE15RZKwKCQGIa6Dv71/triasaldiprasetia-s-team-library?node-id=3311-1703&m=dev
@https://www.figma.com/design/MFniE15RZKwKCQGIa6Dv71/triasaldiprasetia-s-team-library?node-id=3311-3445&m=dev
@https://www.figma.com/design/MFniE15RZKwKCQGIa6Dv71/triasaldiprasetia-s-team-library?node-id=3311-3433&m=dev
@https://www.figma.com/design/MFniE15RZKwKCQGIa6Dv71/triasaldiprasetia-s-team-library?node-id=3354-686&m=dev
@https://www.figma.com/design/MFniE15RZKwKCQGIa6Dv71/triasaldiprasetia-s-team-library?node-id=3354-692&m=dev
@https://www.figma.com/design/MFniE15RZKwKCQGIa6Dv71/triasaldiprasetia-s-team-library?node-id=3354-693&m=dev
@https://www.figma.com/design/MFniE15RZKwKCQGIa6Dv71/triasaldiprasetia-s-team-library?node-id=3311-3&m=dev
@https://www.figma.com/design/MFniE15RZKwKCQGIa6Dv71/triasaldiprasetia-s-team-library?node-id=3330-1349&m=dev

## Implementation Rule

Figma is the primary source of truth for visual implementation.

The 13 nodes must be inspected individually before implementation.

Do not assume that every node represents a separate route.
A node may represent a page, modal, state, component, or another UI composition.

Use:

- `api-contract.md` for the existing Laravel API contract.
- `design-tokens.md` as supporting design-system documentation.

If Figma and `design-tokens.md` differ, follow Figma.

If the Figma design requires functionality that is not supported by the existing backend API, do not invent an API endpoint. Report the backend dependency instead.