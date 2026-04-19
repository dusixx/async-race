export * from './event-name.ts';
export * from './icon.ts';

export enum Pathname {
  Root = '/',
  Garage = '/garage',
  Winners = '/winners',
  Index = '/index',
  NotFound = '/{404}',
}

export enum Visibility {
  Visible = 'visible',
  Hidden = 'hidden',
  None = 'none',
}

export enum KeyboardEventKey {
  Escape = 'Escape',
}
