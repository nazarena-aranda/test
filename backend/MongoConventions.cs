using MongoDB.Bson.Serialization.Conventions;

public static class MongoConventions
{
    public static void RegisterConventions()
    {
        var conventionPack = new ConventionPack
        {
            new CamelCaseElementNameConvention(), // convert to camelCase
            new SnakeCaseElementNameConvention()  // convert to snake_case
        };

        ConventionRegistry.Register("Snake Case", conventionPack, t => true);
    }
}