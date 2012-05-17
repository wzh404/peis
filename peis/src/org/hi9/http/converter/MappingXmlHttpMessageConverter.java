package org.hi9.http.converter;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.AbstractHttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.util.FileCopyUtils;

public class MappingXmlHttpMessageConverter extends AbstractHttpMessageConverter<Object>{
	public static final Charset DEFAULT_CHARSET = Charset.forName("UTF-8");

	public MappingXmlHttpMessageConverter() {
		super(new MediaType("application", "xml", DEFAULT_CHARSET));
	}
	
	@Override
	protected Object readInternal(Class<? extends Object> clazz,
			HttpInputMessage inputMessage) throws IOException,
			HttpMessageNotReadableException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected boolean supports(Class<?> clazz) {
		// TODO Auto-generated method stub
		return HashMap.class.equals(clazz);
	}

	@SuppressWarnings("unchecked")
	@Override
	protected void writeInternal(Object t, HttpOutputMessage outputMessage)
			throws IOException, HttpMessageNotWritableException {
		// TODO Auto-generated method stub
		if (t instanceof Map<?,?>){
			MediaType contentType = outputMessage.getHeaders().getContentType();
			Charset charset = contentType.getCharSet() != null ? contentType.getCharSet() : DEFAULT_CHARSET;
			
			String xml = mapToXml((Map<String,String>)t);
			FileCopyUtils.copy(xml, new OutputStreamWriter(outputMessage.getBody(), charset));
		}
	}

	private String mapToXml(Map<String,String> map){
		String xml = "<?xml version='1.0' encoding='utf-8'?>\n<map>";
		
		for(Map.Entry<String, String> entry : map.entrySet()) {
		    String key = entry.getKey();
		    String val = entry.getValue();
		    
		    xml += "\t<" + key + " value=\"" + val + "\"/>\n";
		}
		
		xml += "</map>";
		
		return xml;
	}
}
