import * as Random from 'expo-random';
import toBuffer from 'typedarray-to-buffer';

if (typeof Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer;
}

let RNS = Buffer.allocUnsafe(0);

function init() {}

export async function prepare(byteCount: number) {
  const buff = await Random.getRandomBytesAsync(byteCount);
  RNS = Buffer.concat([RNS, buff]);
}

export function randomBytes(length: number, cb: (ret: Buffer | null, err?: Error) => void) {
  if (!cb) {
    if (length <= RNS.length) {
      const ret = Buffer.from(RNS.slice(0, length));
      RNS = RNS.slice(length, RNS.length - length);
      return ret;
    } else {
      throw new Error('Should be prepare enough random numbers');
    }
  }

  Random.getRandomBytesAsync(length)
    .then(buff => {
      cb(null, toBuffer(buff));
    })
    .catch(err => {
      cb(err);
    });
}

init();
