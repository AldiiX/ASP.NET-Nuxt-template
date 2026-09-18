namespace server;



public static class Program {
    public static void Main(string[] args) {
        var builder = WebApplication.CreateBuilder(args);
        LoadRootEnv(builder.Configuration);

        builder.Services.AddControllers();
        builder.Services.AddHttpContextAccessor();
        builder.Services.AddHttpClient();

        var app = builder.Build();

        app.UseDefaultFiles();
        app.MapStaticAssets();
        app.UseAuthorization();
        app.UseCors();
        app.MapControllers();
        
        app.Run();
    }
    
    
    
    
    
    
    
    
    
    
    
    
    /// <summary>
    /// nacte .env soubor z rootu projektu primo do konfigurace v dev rezimu bez externich knihoven.
    /// funguje stejne jako user secrets, ale bere hodnoty primo ze sdileneho .env souboru.
    /// </summary>
    private static void LoadRootEnv(ConfigurationManager configuration) {
        foreach (var start in new[] { Directory.GetCurrentDirectory(), AppContext.BaseDirectory }) {
            var dir = new DirectoryInfo(start);
            while (dir != null) {
                var envPath = Path.Combine(dir.FullName, ".env");
                if (File.Exists(envPath)) {
                    var pairs = new List<KeyValuePair<string, string?>>();
                    foreach (var line in File.ReadAllLines(envPath)) {
                        var trimmed = line.Trim();
                        if (string.IsNullOrWhiteSpace(trimmed) || trimmed.StartsWith('#') || !trimmed.Contains('='))
                            continue;
                        var idx = trimmed.IndexOf('=');
                        var key = trimmed[..idx].Trim().Replace("__", ":");
                        var val = trimmed[(idx + 1)..].Trim().Trim('\'', '"');
                        pairs.Add(new KeyValuePair<string, string?>(key, val));
                    }
                    configuration.AddInMemoryCollection(pairs);
                    return;
                }
                if (dir.GetFiles("*.slnx").Length > 0 || dir.GetFiles("*.sln").Length > 0 || dir.GetDirectories(".git").Length > 0)
                    break;
                dir = dir.Parent;
            }
        }
    }
}