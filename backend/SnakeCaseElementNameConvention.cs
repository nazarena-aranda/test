using MongoDB.Bson.Serialization.Conventions;
using System.Globalization;
using System.Text.RegularExpressions;

public class SnakeCaseElementNameConvention : IMemberMapConvention
{
    public string Name => "SnakeCaseElementName";

    public void Apply(MongoDB.Bson.Serialization.BsonMemberMap memberMap)
    {
        var originalName = memberMap.MemberName;
        var snakeCaseName = Regex.Replace(originalName, "([a-z0-9])([A-Z])", "$1_$2")
                                 .ToLower(CultureInfo.InvariantCulture);
        memberMap.SetElementName(snakeCaseName);
    }
}
