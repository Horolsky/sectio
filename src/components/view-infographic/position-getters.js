/* eslint-disable no-console */
export function getRadialPosition(ratio, radius) {
    let degree = Math.PI * 2 * ratio;
    let x = radius + Math.sin(degree) * radius;
    let y = radius - Math.cos(degree) * radius;
    return [x, y];
}
export function getRadialVector(ax, ay, bx, by) {
    let adjacent = ax - bx,
        opposite = ay - by,
        length = (adjacent ** 2 + opposite ** 2) ** 0.5,
        angle = Math.asin(opposite / length) * (180 / Math.PI);

    angle = angle - 180;
    if (adjacent < 0) {
        if (opposite < 0) {
            angle = angle * -1;
            angle = angle + 90 * Math.sign(opposite) - 90;
        } else {
            angle = angle * -1;
            angle = angle + 180;
        }
    }
    return { angle, length }
}
export function getChartBtns(scale, data, map_color, period) {
    let btns = new Array(scale.length);
    if (period != null) {
        for (let i = 0; i < scale.length; i++) {
            let id = scale[i],
                position = getRadialPosition(
                    data[id].rtr / period,
                    50 //chartR
                );
            btns[i] = { id, position };
        }
    } else {
        let maxRtr = //Object.values(s_rtr)
            data.keys.map(key => data[key].rtr)
            .filter((el) => !isNaN(el))
            .reduce(function(a, b) {
                return Math.max(a, b);
            });
        for (let i = 0; i < scale.length; i++) {
            let id = scale[i],
                position = [(data[id].rtr * 100) / maxRtr, 50];
            btns[i] = { id, position }
        }
    }

    for (let i = 0; i < btns.length; i++) {
        btns[i].style = `left: ${btns[i].position[0]}%;top:${btns[i].position[1]}%;`
        btns[i].color = map_color[btns[i].id];
        btns[i].code = data[btns[i].id].code.bold(); // + btns[i].id.toString().sub().sub();
        //todo in css:
        //if (this.linear && !this.vertical_layout) class style: "transform-origin: center;transform: rotate(90deg);"
    }
    return btns;
}
export function getChartIntvs(map_intervals, chart_btns, period) {
    let chart_intervals = [];

    if (period != null) {
        for (let i = 1; i < map_intervals.length; i++) {
            for (let p = 0; p < map_intervals[i].pairs.length; p += 2) {
                let pair = [map_intervals[i].pairs[p], map_intervals[i].pairs[p + 1]],
                    btnA = chart_btns.find(el => el.id == pair[0]),
                    btnB = chart_btns.find(el => el.id == pair[1]);
                if (btnA == null || btnB == null) continue; // skipping equivalents

                let x = btnA.position[0],
                    y = btnA.position[1],
                    bx = btnB.position[0],
                    by = btnB.position[1],
                    active = true,
                    recto = map_intervals[i].recto.euler;

                let vector = getRadialVector(x, y, bx, by),
                    length = vector.length,
                    angle = vector.angle,
                    style = `top:${y}% !important;left:${x}% !important;height: 2px; width: ${length}%;transform-origin: top left;transform: rotate(${angle}deg);`;

                //to class style: position: absolute !important;  background-color: red;

                chart_intervals.push({
                    angle,
                    length,
                    x,
                    y,
                    style,
                    active,
                    recto,
                });
            }
        }
    } else {
        for (let i = 1; i < map_intervals.length; i++) {
            for (let p = 0; p < map_intervals[i].pairs.length; p += 2) {
                let pair = [map_intervals[i].pairs[p], map_intervals[i].pairs[p + 1]],
                    btnA = chart_btns.find(el => el.id == pair[0]),
                    btnB = chart_btns.find(el => el.id == pair[1]);
                if (btnA == null || btnB == null) continue; // skipping equivalents

                let x = btnA.position[0],
                    y = btnA.position[1],
                    bx = btnB.position[0],
                    active = true,
                    recto = map_intervals[i].recto.euler,
                    length = Math.abs(Math.abs(bx) - Math.abs(x)),
                    height = 12 + length * 0.4;

                let style = `top: ${y - height / 2}% !important; left: ${x}% !important;height: ${height}%; width: ${length}%;`;

                chart_intervals.push({
                    x,
                    length,
                    y,
                    style,
                    active,
                    recto,
                });
            }
        }
    }
    return chart_intervals;
}
export default {
    getChartBtns,
    getChartIntvs
}