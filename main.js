const {log} = console;

// 初始化canvas2d
const cvs = document.querySelector("canvas");
const cx = cvs.getContext("2d");

// canvas绘制的横竖长度
let w = cvs.width = cvs.clientWidth;
let h = cvs.height = cvs.clientHeight;
// canvas一行能容纳的行数和列数, +1 防白边
let line_max = Math.ceil(document.documentElement.clientHeight / DRAW_HEIGHT) + 1;
let col_max = Math.ceil(document.documentElement.clientWidth / DRAW_WIDTH) + 1;

window.onresize = ()=> {
  w = cvs.width = cvs.clientWidth;
  h = cvs.height = cvs.clientHeight;
  line_max = Math.ceil(document.documentElement.clientHeight / DRAW_HEIGHT) + 1;
  col_max = Math.ceil(document.documentElement.clientWidth / DRAW_WIDTH) + 1;
  draw_frame();
};

cx.font = "90px sans-serif";


/// 动画目的数值
let global_left = 0;
let global_top = 0;
/// 动画过程数值
let anime = {
  /// 开始时间, 仅用于动画过时检测
  start: Date.now(),
  /// 目前的动画id
  cur_id: 0,
  /// 动画开始时的left
  left: 0,
  /// 动画开始时的top
  top: 0
};


/// 画一帧
function draw_frame() {
  cx.clearRect(0, 0, w, h);
  cancelAnimationFrame(anime.cur_id);
  // 动画时间还没结束就调用下一帧
  if (anime.start + ANIME_TIMEOUT > Date.now()) {
    // 设置动画开始状态
    anime.left += (global_left - anime.left) * ANIME_RATE;
    anime.top += (global_top - anime.top) * ANIME_RATE;
    anime.cur_id = requestAnimationFrame(draw_frame);
  }
  // 最左侧的列的左边 距离屏幕左边的距离
  let left = anime.left % DRAW_WIDTH;
  // 求出整数结果, 作为左侧第一个渲染的列的索引
  let col_first = Math.floor(Math.abs(anime.left / DRAW_WIDTH));
  // 向左移动特殊处理
  if (anime.left>0) {
    left -= DRAW_WIDTH;
    col_first = DATA.length - (col_first + 1) % DATA.length;
  }
  let col_len = col_max + col_first;

  for(let col_i=col_first; col_i<col_len; ++col_i) {
    let {lines, speed} = DATA[col_i==0?0:col_i%DATA.length];
    // 以下运作同left
    let y = anime.top * speed;
    // 减个DRAW_HEIGHT防白边
    let top = y % DRAW_HEIGHT - DRAW_HEIGHT;
    let line_first = Math.floor(Math.abs(y / DRAW_HEIGHT));
    // 向上移动特殊处理
    if (global_top>0) {
      top = top - DRAW_HEIGHT;
      line_first = lines.length - (line_first + 1) % lines.length;
    }
    let line_len = line_max + line_first + 1;

    for(let line_i=line_first; line_i<line_len; ++line_i) {
      let img = lines[line_i==0?0:line_i%lines.length];
      // 用离屏幕最近但在屏幕外的坐标作为原点, 用循环次数*(宽高 + 间距)作为偏移绘制该图像
      let x = left + (col_i - col_first) * (DRAW_WIDTH + DRAW_MARGIN);
      let y = top + (line_i - line_first) * (DRAW_HEIGHT + DRAW_MARGIN);
      cx.drawImage(
        img, 
        x,
        y, 
        DRAW_WIDTH, 
        DRAW_HEIGHT
      )
    }
  }
}
draw_frame()

/// 绑定按钮
window.addEventListener("mousedown",()=>{
  draw_frame();

  let mousemove = (e)=> {
    global_left += e.movementX*2;
    global_top += e.movementY*2;
    anime.start = Date.now();
    draw_frame();
  };
  let mouseup = (e)=> {
    window.removeEventListener("mousemove", mousemove);
    window.removeEventListener("mouseup", mouseup);
  }

  window.addEventListener("mousemove", mousemove);
  window.addEventListener("mouseup", mouseup);
});
