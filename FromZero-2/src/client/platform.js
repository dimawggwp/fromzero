// FromZero · выбор платформы. Один и тот же клиентский код работает в демо (index.html) и в боевом Next.js.
import demo from "./platform.demo.js";
import live from "./platform.live.js";

const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true" || !live;
export const platform = isDemo ? demo : live;
export default platform;
