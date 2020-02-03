const n = 15;
const nMinus = n-1;
let points = [];
let distances = [];
let results = Array(nMinus).fill(0);
let minDistance = 1000000;

function setup() {
  // 点を配置
  for (let i = 0; i < n; i++) {
    let p = [Math.random() * windowWidth, Math.random() * windowHeight];
    points[i] = p;
  }

  // 各点ごとの距離を計算
  for (let i = 0; i < n; i++) {
    let distance = [];
    for (let j = 0; j < n; j++) {
      if (i == j) {
        distance[j] = 0;
      } else {
        distance[j] = Math.sqrt(Math.pow(points[i][0] - points[j][0], 2) + Math.pow(points[i][1] - points[j][1], 2));
      }
    }
    distances[i] = distance;
  }

  calcStartTime = millis();
  // ルートを探索。最初のみsetupに書く。
  let route = Array(nMinus).fill(0);
  let isAdded = Array(nMinus).fill(false);
  for(let addNumber = 0; addNumber < nMinus; addNumber++) {
    isAdded[addNumber] = true;
    route[0] = addNumber;
    calcRoute(0, route, isAdded, distances[nMinus][addNumber]);
    isAdded[addNumber] = false;
  }

  createCanvas(windowWidth, windowHeight);
  background(0);
  startTime = millis();
  console.log((startTime-calcStartTime)/1000);
}

function draw() {
  // 線を引く
  drawRoute(points, results);
}

// calcRoute ルートを探索 スタートはn-1の点
function calcRoute(i, route, isAdded, currentDistance) {
  if (currentDistance > minDistance) {
    return
  }
  if (i+1 == nMinus) {
    if (currentDistance + distances[route[i]][nMinus] < minDistance) {
      for (let j=0; j<nMinus; j++) { // 値渡しをしたいため
        results[j] = route[j];
      }
      minDistance = currentDistance + distances[route[i]][nMinus];
    }
  } else {
    for(let addNumber = 0; addNumber < nMinus; addNumber++) {
      if (isAdded[addNumber] || isCross(i, route, addNumber)) {
			  continue
		  }
      let nextDistance = currentDistance+distances[route[i]][addNumber]
      if (nextDistance > minDistance) {
        continue
      }
      isAdded[addNumber] = true;
		  route[i+1] = addNumber;
      calcRoute(i+1, route, isAdded, nextDistance);
		  isAdded[addNumber] = false;
    }
  }
}

// drawRoute ルートを描画する p:ポイント r:ルート
function drawRoute(p, r) {
  for (let i = 0; i < n; i++) {
    noStroke();
    fill(255);
    ellipse(p[i][0], p[i][1], 10, 10);
  }

  if (startTime+5000 < millis()) {
    strokeWeight(1);
    stroke(255, 3);
    line(p[nMinus][0], p[nMinus][1], p[r[0]][0], p[r[0]][1]);
    for (let i = 0; i < n-2; i++) {
      line(p[r[i]][0], p[r[i]][1], p[r[i+1]][0], p[r[i+1]][1]);
    }
    line(p[r[n-2]][0], p[r[n-2]][1], p[nMinus][0], p[nMinus][1]);
  }
}

// isCross 線が交差するかのチェック。ベクトルを使っている。
function isCross(i, route, addNumber) {
  if (i == 0) {
    return false;
  } else {
    const newPointX2 = points[addNumber][0];
    const newPointY2 = points[addNumber][1];
    const newPointX1 = points[route[i]][0];
    const newPointY1 = points[route[i]][1];

    for (let j=0; j<=i; j++) {
      const oldPointX2 = points[route[j]][0];
      const oldPointY2 = points[route[j]][1];
      if (j == 0) {
        var oldPointX1 = points[nMinus][0];
        var oldPointY1 = points[nMinus][1];
      } else {
        var oldPointX1 = points[route[j-1]][0];
        var oldPointY1 = points[route[j-1]][1];
      }

      const v1X = oldPointX2-newPointX1;
      const v1Y = oldPointY2-newPointY1;
      const v2X = oldPointX1-newPointX1;
      const v2Y = oldPointY1-newPointY1;
      const v3X = newPointX2-newPointX1;
      const v3Y = newPointY2-newPointY1;
      const tUp = (v2Y*v3X-v2X*v3Y);
      const uUp = (v1X*v3Y-v1Y*v3X);
      const paramsDown = v1X*v2Y-v1Y*v2X;

      // なるべく早く判断できるように調整
      if (tUp*uUp>0) {
        if (tUp+uUp>paramsDown) {
          if (paramsDown>0) {
            return true;
          }
        } else if (paramsDown<0) {
          return true;
        }
      }
    }
  }
  return false;
}
