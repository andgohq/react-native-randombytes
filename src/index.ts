import * as Random from 'expo-random';

export const RNS_MAX = 1024;

const max = (a: number, b: number) => (a < b ? b : a);

if (typeof Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer;
}

let RNS = Buffer.allocUnsafe(0);

export async function init() {
  await generate(RNS_MAX);
}

async function generate(byteCount: number) {
  if (byteCount == 0) {
    return;
  }

  const buff = await Random.getRandomBytesAsync(byteCount);
  RNS = Buffer.concat([RNS, Buffer.from(buff)]);
}

export function randomBytes(length: number, cb: (err?: Error, ret?: Buffer) => void) {
  if (!cb) {
    if (length <= RNS.length) {
      const ret = Buffer.from(RNS.slice(0, length));
      RNS = RNS.slice(length, RNS.length - length);

      generate(max(0, RNS_MAX - RNS.length));

      return ret;
    } else {
      throw new Error('Should be prepare enough random numbers');
    }
  }

  Random.getRandomBytesAsync(length)
    .then(buff => {
      cb(null, Buffer.from(buff));
    })
    .catch(err => {
      cb(err);
    });
}
