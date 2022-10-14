// Number.EPSILON in case round 1.005 => 1.01
const round2Dec = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

const round3Dec = (num: number) => Math.round((num + Number.EPSILON) * 1000) / 1000;

const round4Dec = (num: number) => Math.round((num + Number.EPSILON) * 10000) / 10000;

export { round2Dec, round3Dec, round4Dec };
