
let ctx; // canvas context
let cells = []; // 描画する際のデータ配列　cell
let cols, rows; // ？×？の数値
let timer = null; // インターバル用の変数
let resizeTimer = 0; // リサイズ終了時判定のタイマーカウント
let cellSize = 40; // セル単体のサイズ

window.addEventListener("DOMContentLoaded", () => {
  ctx = document.querySelector("canvas").getContext("2d");
  initCanvas();
  // 開始
  StartLifeGame();
  // GUI
  const g = new GuiSettings();
  const gui = new dat.GUI();
  gui.add(g, "Start");
  gui.add(g, "CellSize", 40, 100).onFinishChange((value) => {
    cellSize = value;
    StartLifeGame();
  });
}, false);

window.addEventListener("resize", (e) => {
  initCanvas();

  if(resizeTimer > 0) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Resize時、再開始
    StartLifeGame();
  }, 200);
}, false);

const GuiSettings = function() {
  this.Start = () => {
    StartLifeGame();
  };
  this.CellSize = 40;
};

const initCanvas = () => {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  cols = Math.round(ctx.canvas.width / cellSize);
  rows = Math.round(ctx.canvas.height / cellSize);
};

const StartLifeGame = () => {
  initCell();
  if(timer != null) clearInterval(timer);
  timer = setInterval(DrawLifeGame, 10);
};

// 初回にセルを作る
const initCell = () => {
  for(var i = 0; i < cols; i++) {
    cells[i] = [];
    for(var j = 0; j < rows; j++) {
      cells[i][j] = Math.round(Math.random()); // 0-1で状態を保管する
    }
  }
  drawCell();
};

// セルを描画する
const drawCell = () => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for(var i = 0; i < cols; i++) {
    for(var j = 0; j < rows; j++) {
      const value = cells[i][j]; // 0 | 1の値を持たせている 
      const style = !value ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)"; 
      // 描画四角形
      ctx.fillStyle = style;
      ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
      // 枠線
      ctx.strokeStyle = "rgb(60, 60, 60)";
      ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }
};

// フレームを再計算
const DrawLifeGame = () => {
  let result = []; // 仮置き配列
  for(var i = 0; i < cols; i++) {
    result[i] = []; // 空にする
    for(var j = 0; j < rows; j++) {
      // 周りに？個生存するかを取得
      const count = AliveAroundCount(i, j);
      if(cells[i][j]) {
        // 生存 > 生きているセルに隣接する生きたセルが2つか3つならば、次の世代でも生存する。
        if(count === 2 || count === 3) result[i][j] = 1;
        // 死亡
        else result[i][j] = 0;
      } else {
        // 生存 > 死んでいるセルに隣接する生きたセルがちょうど3つあれば、次の世代が誕生する。
        if(count === 3) result[i][j] = 1;
        else result[i][j] = 0;
      }
    }
  }
  cells = result; // 結果を更新
  drawCell(); // 再描画
};

// 周りに何個生存するかを数値で返す
const AliveAroundCount = (x, y) => {
  let result = 0;
  for(var i = -1; i <= 1; i++) { // -1 <-0-> 1
    for(var j = -1; j <= 1; j++) { // -1 <-0-> 1
      // i == 0は変化が確認できないため通す
      if(i != 0 || j != 0) {
        // 跳ね返り、生存確認をみている。上下左右（x軸は左右、y軸は上下）
        if((x + i >= 0 && x + i < cols) && (y + j >= 0 && y + j < rows)) {
          result += cells[x + i][y + j];
        }
      }
    }
  }
	return result;
};