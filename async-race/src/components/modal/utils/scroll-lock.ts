const { body } = document;

const isVScrollBarVisible = (): boolean => {
  const currentBodyClientWidth = body.clientWidth;
  const currentBodyOverflow = body.style.overflow;

  body.style.overflow = 'hidden';
  const result = currentBodyClientWidth !== body.clientWidth;
  body.style.overflow = currentBodyOverflow;

  return result;
};

const scrollLockStyle = (bodyCssText: string, windowTopY: number): string => {
  return `
    ${bodyCssText};
    position: fixed;
    top: -${windowTopY.toString()}px;
    width: 100%;
    overflow-y: ${isVScrollBarVisible() ? `scroll` : `hidden`};
  `;
};

class ScrollLock {
  private windowTopY: number = 0;
  private bodyCssText: string = '';
  private locked: boolean = false;

  public lock(): boolean {
    this.windowTopY = window.scrollY;
    this.bodyCssText = body.style.cssText;
    this.locked = true;

    body.style.cssText = scrollLockStyle(this.bodyCssText, this.windowTopY);

    return this.locked;
  }

  public unlock(): boolean {
    this.locked = false;

    body.style.cssText = this.bodyCssText;
    body.style.scrollBehavior = 'auto';
    window.scrollTo({ top: this.windowTopY });
    body.style.removeProperty('scroll-behavior');

    return this.locked;
  }

  public toggle(force?: boolean): boolean {
    const flag = force == null ? this.locked : !force;
    return flag ? this.unlock() : this.lock();
  }
}

export const scrollLock = new ScrollLock();
