import { scrollLockStyle } from './scroll-lock.utils.ts';

const { body } = document;

class _ScrollLock {
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

export const ScrollLock = new _ScrollLock();
