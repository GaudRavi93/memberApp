import { UnixTimestampPipe } from './date.pipe';

describe('UnixTimestampPipe', () => {
  it('create an instance', () => {
    const pipe = new UnixTimestampPipe();
    expect(pipe).toBeTruthy();
  });
});
