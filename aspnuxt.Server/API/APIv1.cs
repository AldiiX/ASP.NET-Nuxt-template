using Microsoft.AspNetCore.Mvc;

namespace aspnuxt.Server.API;

[ApiController]
[Route("api/v1")]
public class APIv1 : Controller {

    [HttpGet]
    public IActionResult Index() {
        return Ok(new {
            status = "ok",
            message = "API v1 is running",
            timestamp = DateTime.UtcNow
        });
    }
}