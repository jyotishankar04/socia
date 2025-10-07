import app from "./";
import _env from "./config";
import logger from "./config/logger";

app.listen(_env.PORT, () => {
    logger.info(`Server running on port ${_env.PORT}`);
});