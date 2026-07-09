export const secondsToTimeStr = totalSeconds => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    let time = "";
    time += (minutes < 10 ? "0" + minutes : minutes) + ":";
    time += seconds < 10 ? "0" + seconds : seconds;
    return time
};
