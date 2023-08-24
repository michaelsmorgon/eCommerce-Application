function findAnchorElement(startingElement: HTMLElement | null): HTMLAnchorElement | null {
  let element = startingElement;
  while (element && element.tagName !== 'A' && element.tagName !== 'BUTTON') {
    element = element.parentNode as HTMLElement;
  }
  return element as HTMLAnchorElement | null;
}

export function route(event: MouseEvent): void {
  const anchorElement = findAnchorElement(event.target as HTMLElement);

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
