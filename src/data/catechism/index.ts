
import { lordsDays1To10 } from './lords-days-1-10';
import { lordsDays11To20 } from './lords-days-11-20';
import { lordsDays21To31 } from './lords-days-21-31';
import type { LordsDay } from './types';

export const catechism: LordsDay[] = [
  ...lordsDays1To10,
  ...lordsDays11To20,
  ...lordsDays21To31,
];

export type { Question, LordsDay } from './types';
