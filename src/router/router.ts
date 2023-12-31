function findAnchorElement(startingElement: HTMLElement | null): HTMLAnchorElement | null {
  let element = startingElement;
  while (element && element.tagName !== 'A' && element.tagName !== 'BUTTON' && element.tagName !== 'DIV') {
    element = element.parentNode as HTMLElement;
  }
  return element as HTMLAnchorElement | null;
}

export function route(event: MouseEvent): void {
  let anchorElement = null;
  if (event.currentTarget !== null) {
    anchorElement = findAnchorElement(event.currentTarget as HTMLElement);
  } else {
    anchorElement = findAnchorElement(event.target as HTMLElement);
  }

  if (!anchorElement) {
    return;
  }

  event.preventDefault();

  const href = anchorElement.getAttribute('href');

  if (!href) {
    return;
  }
  window.history.pushState({}, '', href);

  const popStateEvent = new PopStateEvent('popstate', {});
  window.dispatchEvent(popStateEvent);
}
