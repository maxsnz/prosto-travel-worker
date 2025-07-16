import Koa from "koa";
import Router from "@koa/router";
import generateGuideHtml from "./generateGuideHtml";

const app = new Koa();
const router = new Router();

router.get("/guide/:guideId", async (ctx: Koa.Context) => {
  const guideId = parseInt(ctx.params.guideId, 10);
  const htmlContent = await generateGuideHtml(guideId);

  ctx.type = "html";
  ctx.body = `<!DOCTYPE html>${htmlContent}`;
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
  console.log("Dev server started at http://localhost:3000");
});
