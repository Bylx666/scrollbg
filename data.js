
// 原图片统一数据
const WIDTH = 790;
const HEIGHT = 1181;

// 绘制属性长宽
const DRAW_WIDTH = 0|(WIDTH / 2.5);
const DRAW_HEIGHT = 0|(HEIGHT / 2.5);

// 绘制属性距离
const DRAW_MARGIN = 10;

// 鼠标拖动惯性量(<1)
const ANIME_RATE = 0.03;
// 动画超时(ms), 多大都行不影响性能
const ANIME_TIMEOUT = 3000;

const DATA = [
  {
    lines: ["1","2","3","4"],
    speed: 1
  },
  {
    lines: ["3","2","1"],
    speed: 1.2
  },
  {
    lines: ["3","1"],
    speed: 1.4
  },
  {
    lines: ["2","4","5"],
    speed: 1.6
  },
  {
    lines: ["5","1","5"],
    speed: 1.2
  },
  {
    lines: ["6","6","6"],
    speed: 1.4
  },
];
for(o of DATA) {
  let {lines} = o;
  for(let i=0; i<lines.length; ++i) {
    let img = new Image(WIDTH, HEIGHT);
    img.src = `/imgs/${lines[i]}.jpg`;
    lines[i] = img;
  }
}