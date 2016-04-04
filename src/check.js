var getMessage = function (a, b) {
    if (typeof a === 'boolean') {
        if (a === true) {
            return 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
        }
        else {
            return 'Переданное GIF-изображение не анимировано';
        }
    }
    if (typeof a === 'number') {
        return 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + (b * 4) + ' атрибутов';
    }
    if (a instanceof Array) {
        var total = 0;
        if (b instanceof Array) {
            for (var i = 0; i < a.length; i++) {
                total += (a[i]*b[i]);
            }
            return 'Общая площадь артефактов сжатия: ' + total + ' пикселей';
        }
        else {
            for (var i = 0; i < a.length; i++) {
                total += a[i];
            }
            return 'Количество красных точек во всех строчках изображения: ' + total;
        }
    }
}

