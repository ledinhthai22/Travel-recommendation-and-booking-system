using System.Text.RegularExpressions;

namespace travel_recommendation_and_booking_system.Helper
{
    public static class SlugHelper
    {
        public static string GenerateSlug(string phrase)
        {
            if (string.IsNullOrEmpty(phrase))
                return string.Empty;

            string str = phrase.ToLowerInvariant();

            str = RemoveSignForVietnameseString(str);

            str = Regex.Replace(str, @"[^a-z0-9\s-]", "");

            str = Regex.Replace(str, @"\s+", " ").Trim();

            str = str.Replace(" ", "-");

            str = Regex.Replace(str, @"-+", "-");

            return str;
        }

        private static string RemoveSignForVietnameseString(string str)
        {
            string[] signedChars = new string[]
            {
                "aàáảãạâầấẩẫậăằắẳẵặ",
                "eèéẻẽẹêềếểễệ",
                "iìíỉĩị",
                "oòóỏõọôồốổỗộơờớởỡợ",
                "uùúủũụưừứửữự",
                "yỳýỷỹỵ",
                "dđĐ"
            };

            string replaceChars = "aeiouyd";

            for (int i = 0; i < signedChars.Length; i++)
            {
                foreach (char c in signedChars[i])
                {
                    if (str.Contains(c))
                    {
                        str = str.Replace(c, replaceChars[i]);
                    }
                }
            }

            return str;
        }
    }
}
