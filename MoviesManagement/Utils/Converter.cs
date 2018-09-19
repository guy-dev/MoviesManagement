using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Formatters.Binary;
using System.Threading.Tasks;

namespace MoviesManagement.Utils
{
    public class Converter
    {
		private static Converter converter = new Converter();

	    public static Converter Instance()
	    {
		    return converter;
	    }

	    // Convert an object to a byte array
	    public byte[] ObjectToByteArray(Object obj)
	    {
		    if (obj == null)
			    return null;

		    BinaryFormatter bf = new BinaryFormatter();
		    MemoryStream ms = new MemoryStream();
		    bf.Serialize(ms, obj);

		    return ms.ToArray();
	    }

		// Convert a byte array to an Object
	    public Object ByteArrayToObject(byte[] arrBytes)
	    {
		    MemoryStream memStream = new MemoryStream();
		    BinaryFormatter binForm = new BinaryFormatter();
		    memStream.Write(arrBytes, 0, arrBytes.Length);
		    memStream.Seek(0, SeekOrigin.Begin);
		    Object obj = (Object)binForm.Deserialize(memStream);

		    return obj;
	    }
	}
}
