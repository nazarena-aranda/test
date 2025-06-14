using MongoDB.Bson.Serialization.Conventions;

public static class MongoConventions
{
    public static void RegisterConventions()
    {
        var conventionPack = new ConventionPack
        {
            new CamelCaseElementNameConvention(), // convierte a camelCase
            new SnakeCaseElementNameConvention()  // convierte a snake_case
        };

        ConventionRegistry.Register("Snake Case", conventionPack, t => true);
    }
}